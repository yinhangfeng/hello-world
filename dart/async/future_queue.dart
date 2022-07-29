import 'dart:async';

import 'package:collection/collection.dart';
import '../foundation/errors.dart';
import 'cancelable.dart';

enum _TaskState {
  pending,
  running,
  success,
  error,
  canceled,
}

typedef _OnTaskCancelCallback = void Function(_Task task);

class _Task<T> implements Comparable<_Task> {
  _Task(
    this.closure, {
    this.priority,
    this.executeTime = 0,
    Completer<T>? completer,
    required CancelController cancelController,
    _OnTaskCancelCallback? onCancel,
  })  : completer = completer ?? Completer<T>(),
        cancelController = cancelController,
        _onCancel = onCancel {
    _cancelSub = cancelController.listen(this.onCancel);
  }

  final Future Function() closure;
  final int? priority;
  final int executeTime;
  final Completer<T> completer;
  final CancelController cancelController;
  _TaskState _state = _TaskState.pending;
  StreamSubscription? _cancelSub;
  final _OnTaskCancelCallback? _onCancel;

  _TaskState get state => _state;

  @override
  int compareTo(_Task other) {
    var result = executeTime - other.executeTime;
    if (result == 0) {
      result = priority! - other.priority!;
    }
    return result;
  }

  void onStart() {
    _state = _TaskState.running;
  }

  void onResult(T result) {
    assert(_state == _TaskState.running);
    _state = _TaskState.success;
    _cancelSub!.cancel();
    completer.complete(result);
  }

  void onError(Object error, [StackTrace? stackTrace]) {
    assert(_state == _TaskState.running);
    _state = _TaskState.error;
    _cancelSub!.cancel();
    completer.completeError(error, stackTrace);
  }

  void onCancel(CancelError? cancelError) {
    assert(_state != _TaskState.success && _state != _TaskState.error);
    if (_state == _TaskState.pending) {
      _onCancel!(this);
    }
    // 可能会进入两次 一次 cancelController.listen 一次 _process 内部触发
    if (!completer.isCompleted) {
      _state = _TaskState.canceled;
      completer.completeError(cancelError!);
      _cancelSub!.cancel();
    }
  }
}

/// 异步任务队列
class FutureQueue {
  FutureQueue({this.maxConcurrent = 1}) : assert(maxConcurrent > 0);

  final PriorityQueue<_Task> _queue = PriorityQueue();

  /// 最大并发任务数
  final int maxConcurrent;
  int _runningTask = 0;

  /// 运行中的任务数
  int get runningLength => _runningTask;

  /// 排队中的任务数
  int get queueLength => _queue.length;

  // TODO process zone
  void _process() async {
    if (_queue.isEmpty || _runningTask >= maxConcurrent) {
      return;
    }
    var task = _queue.first;

    if (task.cancelController.isCanceled) {
      _queue.removeFirst();
      // task 内部有订阅 cancelController 这里调用 onCancel 应该没作用
      task.onCancel(task.cancelController.cancelError);
      scheduleMicrotask(_process);
      return;
    }

    var now = DateTime.now().millisecondsSinceEpoch;
    if (task.executeTime > now) {
      Timer(Duration(milliseconds: task.executeTime - now), _process);
      return;
    }

    _queue.removeFirst();
    ++_runningTask;
    task.onStart();
    try {
      var res = await task.closure();
      if (task.cancelController.isCanceled) {
        task.onCancel(task.cancelController.cancelError);
      } else {
        task.onResult(res);
      }
    } catch (e, s) {
      if (task.cancelController.isCanceled) {
        task.onCancel(task.cancelController.cancelError);
      } else {
        task.onError(e, s);
      }
    }
    --_runningTask;
    scheduleMicrotask(_process);
  }

  void _onTaskCancel(_Task task) {
    _queue.remove(task);
  }

  /// 添加任务
  /// [priority] 任务优先级，当执行时间相同时数值小的先执行
  /// [delay] 任务执行延迟时间
  /// [executeTime] 任务执行时间，默认为立即执行
  /// [cancelToken] 任务可取消，取消之后返回的 Future 会进入 CancelError，但任务 closure 的执行并不会取消，需要 closure 内部自己处理 cancelToken
  Future<T?> add<T>(
    Future<T> Function() closure, {
    int priority = 0,
    Duration? delay,
    DateTime? executeTime,
    CancelToken? cancelToken,
  }) {
    if (cancelToken != null && cancelToken.isCanceled) {
      return Future.error(cancelToken.cancelError!);
    }
    if (executeTime == null) {
      if (delay != null) {
        executeTime = DateTime.now().add(delay);
      } else {
        executeTime = DateTime.now();
      }
    }
    final _Task task = _Task<T>(closure,
        priority: priority,
        executeTime: executeTime.millisecondsSinceEpoch,
        cancelController: CancelController(parent: cancelToken),
        onCancel: _onTaskCancel);
    _queue.add(task);
    _process();
    return task.completer.future.then((value) => value as T?);
  }

  /// 取消所有任务
  /// NOTE: 目前只清除正在排队的
  void clear() {
    _Task task;
    while (_queue.isNotEmpty) {
      task = _queue.removeFirst();
      task.cancelController.cancel();
    }
  }
}
