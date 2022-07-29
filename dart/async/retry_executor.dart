import 'dart:async';

import 'package:pedantic/pedantic.dart';

import '../foundation/errors.dart';
import 'future_queue.dart';
import 'cancelable.dart';
import 'executor.dart';

/// 带重试功能的执行器
/// 首次重试会延迟 startRetryInterval，之后每次重试延迟时间都会加倍，最大延迟时间为 maxRetryInterval
class RetryExecutor extends Executor {
  final int _maxRetries;
  final int _startRetryInterval;
  final int _maxRetryInterval;
  final FutureQueue? _queue;
  final bool _retryOnProgramError;

  /// [maxRetries] 最大重试次数
  /// [startRetryInterval] 首次重试间隔时间 ms
  /// [maxRetryInterval] 重试最大间隔时间
  /// [retryOnProgramError] 当发生 program error 时是否需要重试
  /// [queue] 如果提供了执行队列，则执行和重试都会在队列上执行
  RetryExecutor(
      {int maxRetries = 3,
      int startRetryInterval = 1000,
      int maxRetryInterval = 64000,
      bool retryOnProgramError = false,
      FutureQueue? queue})
      : assert(startRetryInterval > 0),
        assert(maxRetryInterval > 0),
        _maxRetries = maxRetries,
        _startRetryInterval = startRetryInterval,
        _maxRetryInterval = maxRetryInterval,
        _retryOnProgramError = retryOnProgramError,
        _queue = queue;

  @override
  Future<T> execute<T>(Future<T> Function() closure,
      {Object? key,
      int? maxRetries,
      int? startRetryInterval,
      int? maxRetryInterval,
      CancelToken? cancelToken}) {
    maxRetries = maxRetries ?? _maxRetries;
    startRetryInterval = startRetryInterval ?? _startRetryInterval;
    maxRetryInterval = maxRetryInterval ?? _maxRetryInterval;

    if (_queue == null) {
      return _retryWithLoop(closure,
          maxRetries: maxRetries,
          startRetryInterval: startRetryInterval,
          maxRetryInterval: maxRetryInterval,
          cancelToken: cancelToken);
    }

    return _retryWithQueue(closure,
        maxRetries: maxRetries,
        startRetryInterval: startRetryInterval,
        maxRetryInterval: maxRetryInterval,
        cancelToken: cancelToken);
  }

  Future<T> _retryWithLoop<T>(Future<T> Function() closure,
      {int? maxRetries,
      int? startRetryInterval,
      int? maxRetryInterval,
      CancelToken? cancelToken}) async {
    var retries = 0;
    var retryInterval = startRetryInterval;
    while (true) {
      try {
        var result = await closure();
        // 任务完成之后是否需要检查 cancelController？ 可配置?
        return result;
      } catch (e) {
        assert(() {
          print(
              'RetryExecutor execute error $e retries: $retries maxRetries: $maxRetries');
          return true;
        }());
        if (!_retryOnProgramError && e is Error) {
          rethrow;
        }
        if (e is CancelError) {
          // 如果是内部的取消错误，不需要重试
          rethrow;
        }
        cancelToken?.throwIfCanceled();
        ++retries;
        if (retries > maxRetries!) {
          rethrow;
        }
      }

      await cancelableDelayed(Duration(milliseconds: retryInterval!),
          cancelToken: cancelToken);

      retryInterval *= 2;
      if (retryInterval > maxRetryInterval!) {
        retryInterval = maxRetryInterval;
      }
    }
  }

  Future<T> _retryWithQueue<T>(Future<T> Function() closure,
      {int? maxRetries,
      required int startRetryInterval,
      int? maxRetryInterval,
      CancelToken? cancelToken}) {
    var retries = 0;
    var retryInterval = startRetryInterval;
    var completer = Completer<T>();

    Future<void> doExecute() async {
      try {
        var result = await closure();
        // 任务完成之后是否需要检查 cancelController？ 可配置?
        completer.complete(result);
        return;
      } catch (e, s) {
        assert(() {
          print(
              'RetryExecutor execute error $e retries: $retries maxRetries: $maxRetries');
          return true;
        }());
        if (!_retryOnProgramError && e is Error) {
          completer.completeError(e, s);
          return;
        }
        if (e is CancelError) {
          // 如果是内部的取消错误，不需要重试
          completer.completeError(e);
          return;
        }
        if (cancelToken != null && cancelToken.isCanceled) {
          completer.completeError(cancelToken.cancelError!);
          return;
        }
        ++retries;
        if (retries > maxRetries!) {
          completer.completeError(e);
          return;
        }
      }

      unawaited(
          _queue!.add(doExecute, delay: Duration(milliseconds: retryInterval)));

      retryInterval *= 2;
      if (retryInterval > maxRetryInterval!) {
        retryInterval = maxRetryInterval;
      }
    }

    _queue!.add(doExecute);

    return completer.future;
  }
}
