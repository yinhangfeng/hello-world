import 'cancelable.dart';

/// 任务执行器
abstract class Executor {
  /// [closure] 要执行的任务函数
  /// [key] 任务的 key
  /// [cancelToken] 任务可取消
  Future<T> execute<T>(Future<T> Function() closure,
      {Object? key, CancelToken? cancelToken});
}
