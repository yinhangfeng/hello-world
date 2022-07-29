import 'dart:async';

import '../foundation/errors.dart';

typedef CancelErrorCallback = void Function(CancelError? cancelError);

/// 代表一个可取消的任务
/// ## Examples
/// ```dart
/// // 一般 cancelToken 作为命名参数可选传入
/// // 传入了 cancelToken 的函数需要确保如果被 cancel 了之后返回的 Future 一定会进入 CancelError
/// // 但不要求被 cancel 之后函数立即返回 CancelError Future
/// Future someTask({ CancelToken cancelToken }) async {
///   // 调用其它支持 cancelToken 的异步函数
///   await doSomething1(cancelToken: cancelToken);
///
///   try {
///     // 调用不支持 cancelToken 的异步函数
///     var result2 = await doSomething2();
///     // ...
///     // 由于调用了不支持 cancelToken 的异步函数，所以需要检查 cancelToken
///     cancelToken?.throwIfCanceled();
///   } catch (e) {
///     // ...
///     // cancelToken 的判断需要优先于 rethrow (如果有的话)
///     cancelToken?.throwIfCanceled();
///     // ... maybe rethrow
///   }
///
///   // 另一种调用不支持 cancelToken 异步函数的方式，这样被 cancel 之后会立即抛出 CancelError，但是 doSomething3 还在执行
///   await Future.any([doSomething3(), cancelToken?.wait()]);
///
///   // ...
/// }
///
/// // ...
/// var cancelController = CancelController();
/// await someTask(cancelToken: cancelController);
///
/// // 取消任务
/// cancelController.cancel();
/// ```
/// https://github.com/littledan/proposal-cancelable-promises
abstract class CancelToken {
  /// 是否已被取消
  bool get isCanceled;

  /// 当前的 cancelError
  /// 如果未取消则为 null
  CancelError? get cancelError;

  /// 如果已被取消则抛出 cancelError
  void throwIfCanceled();

  /// 监听取消事件
  /// [throwIfCanceled] 如果当前已经取消则抛出异常
  /// [immediateCallIsCanceled] 如果当前已经取消则 listener 会立即回调
  StreamSubscription? listen(
    CancelErrorCallback listener, {
    bool throwIfCanceled = false,
    bool immediateCallIsCanceled = false,
  });

  StreamSubscription listenOrThrow(
    CancelErrorCallback listener, {
    bool immediateCallIsCanceled = false,
  });

  /// 等待直到被取消
  /// 如果被取消返回的 Future 会以 Future.error(CancelError) 结束
  Future<void> wait();
}

/// CancelToken 的控制器
class CancelController implements CancelToken {
  /// [parent] 父级 CancelToken，父级取消之后会导致当前 CancelController 也被取消，当前 CancelController 取消不会影响父级
  CancelController({CancelToken? parent}) {
    if (parent != null) {
      _parentSubscription =
          parent.listen((cancelError) => cancel(cancel: cancelError));
    }
  }

  CancelError? _cancelError;
  StreamController<CancelError?>? _cancelStreamController;
  StreamSubscription? _parentSubscription;

  CancelToken get token => this;

  @override
  bool get isCanceled => _cancelError != null;

  @override
  CancelError? get cancelError => _cancelError;

  /// 取消 CancelToken
  void cancel({CancelError? cancel, String? reason}) {
    if (isCanceled) {
      assert(() {
        print('CancelController already canceled!!!');
        return true;
      }());
      return;
    }
    _cancelError = cancel ?? CancelError(message: reason);
    if (_cancelStreamController != null) {
      _cancelStreamController!.add(_cancelError);
      _cancelStreamController = null;
    }
    if (_parentSubscription != null) {
      _parentSubscription!.cancel();
      _parentSubscription = null;
    }
  }

  @override
  void throwIfCanceled() {
    if (isCanceled) {
      throw _cancelError!;
    }
  }

  @override
  StreamSubscription? listen(
    CancelErrorCallback listener, {
    bool throwIfCanceled = false,
    bool immediateCallIsCanceled = false,
  }) {
    if (throwIfCanceled) {
      this.throwIfCanceled();
    }
    if (isCanceled) {
      if (immediateCallIsCanceled) {
        listener(_cancelError);
      }
      return null;
    }
    _cancelStreamController ??= StreamController.broadcast();
    return _cancelStreamController!.stream.listen(listener);
  }

  @override
  StreamSubscription listenOrThrow(
    CancelErrorCallback listener, {
    bool immediateCallIsCanceled = false,
  }) {
    return listen(listener,
        throwIfCanceled: true,
        immediateCallIsCanceled: immediateCallIsCanceled)!;
  }

  @override
  Future<void> wait() {
    Completer completer = Completer<void>();
    listen((cancelError) {
      completer.completeError(cancelError!);
    });
    return completer.future;
  }

  /// 如果 CancelController 不需要了且不能 cancel 则需要调用 dispose
  void dispose() {
    _cancelStreamController = null;
    if (_parentSubscription != null) {
      _parentSubscription!.cancel();
      _parentSubscription = null;
    }
  }
}

/// 类似 [Future.delayed] 不过可以取消
Future<T?> cancelableDelayed<T>(
  Duration duration, {
  FutureOr<T> Function()? computation,
  CancelToken? cancelToken,
}) {
  if (cancelToken == null) {
    return Future.delayed(duration);
  }
  if (cancelToken.isCanceled) {
    return Future.error(cancelToken.cancelError!);
  }
  Completer result = Completer<T>();
  StreamSubscription? subscription;
  var timer = Timer(duration, () {
    subscription!.cancel();
    if (computation == null) {
      result.complete(null);
    } else {
      try {
        result.complete(computation());
      } catch (e, s) {
        result.completeError(e, s);
      }
    }
  });
  subscription = cancelToken.listen((cancelError) {
    timer.cancel();
    result.completeError(cancelError!);
  });
  return result.future.then((value) => value as T?);
}
