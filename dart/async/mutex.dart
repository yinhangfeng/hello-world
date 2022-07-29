import 'dart:async';

import 'cancelable.dart';

/// 互斥锁
///
/// ## Examples
/// ```dart
/// Mutex mutex = Mutex();
///
/// await mutex.acquire(key: key, cancelToken: cancelToken);
/// try {
///   // do something...
/// } finally {
///   mutex.release(key: key);
/// }
/// ```
class Mutex {
  final Map<Object?, Completer<void>> _locks = {};

  /// 申请互斥锁
  /// [key] 互斥锁的 key，需要实现 hashCode，是一个创建多个锁的简便方案，内部会使用 Map 存储
  /// [cancelToken] 可取消，当取消之返回的 Future 会进入 CancelError；当被取消时不会申请锁所以也不能调用 release
  /// 返回 Future 值为 true 时代表至少等待了一个进入互斥区域的锁
  Future<bool> acquire({Object? key, CancelToken? cancelToken}) async {
    var lock = _locks[key];
    var hasLock = lock != null;
    while (lock != null) {
      if (cancelToken != null) {
        await Future.any([lock.future, cancelToken.wait()]);
      } else {
        await lock.future;
      }
      lock = _locks[key];
    }

    _locks[key] = Completer();

    return hasLock;
  }

  /// 释放锁，要与 acquire 成对调用
  /// [key] 互斥锁 key
  /// 如果调用的时候所不存在则会抛出 StateError
  void release({Object? key}) {
    var lock = _locks[key];
    if (lock == null) {
      throw StateError('No lock to release.');
    }
    _locks.remove(key);
    lock.complete();
  }

  /// 申请互斥锁并运行 criticalSection
  Future<T> guard<T>(Future<T> Function() criticalSection,
      {Object? key, CancelToken? cancelToken}) async {
    await acquire(key: key, cancelToken: cancelToken);
    try {
      return await criticalSection();
    } finally {
      release(key: key);
    }
  }
}
