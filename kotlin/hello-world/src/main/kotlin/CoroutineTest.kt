import kotlinx.coroutines.*
import kotlin.concurrent.thread
import kotlin.system.measureTimeMillis

suspend fun coroutineTest01(arg1: Int): Int {
    return arg1 + 1
}

suspend fun coroutineTest02(arg1: Int): Int {
    delay(100)
    return arg1 + 2
}

suspend fun coroutineTest0(arg1: Int): Int {
    val a = coroutineTest01(arg1)
    val b = coroutineTest02(a)
    return b + 1
//    return a
}

fun coroutineTest1() {
    // this is your first suspending function
    suspend fun doWorld() {
        delay(1000L)
        println("World!")
    }

    suspend fun test1() {
        coroutineScope {
            val job = launch {
                doWorld()
            }
            println("Hello")
//            job.cancel()
            job.join()
            println("Done")
        }
    }

    runBlocking { // this: CoroutineScope
        test1()
    }
}

// coroutine 是轻量的
fun coroutineTest2() {
    runBlocking {
        repeat(100_000) { // launch a lot of coroutines
            launch {
                delay(5000L)
                print(".")
            }
        }
    }
}

fun coroutineTest3() {
    suspend fun doSomethingUsefulOne(): Int {
        delay(1000L) // pretend we are doing something useful here
        return 13
    }

    suspend fun doSomethingUsefulTwo(): Int {
        delay(1000L) // pretend we are doing something useful here, too
        return 29
    }
    runBlocking {
        val time = measureTimeMillis {
            // 并发执行 doSomethingUsefulOne doSomethingUsefulTwo
            val one = async { doSomethingUsefulOne() }
            val two = async { doSomethingUsefulTwo() }
            println("The answer is ${one.await() + two.await()}")
        }
        println("Completed in $time ms")
    }
}

fun coroutineTest4() {
    runBlocking {
        launch { // context of the parent, main runBlocking coroutine
            println("main runBlocking      : I'm working in thread ${Thread.currentThread().name}")
        }
        launch(Dispatchers.Unconfined) { // not confined -- will work with main thread
            println("Unconfined            : I'm working in thread ${Thread.currentThread().name}")
        }
        launch(Dispatchers.Default) { // will get dispatched to DefaultDispatcher
            println("Default               : I'm working in thread ${Thread.currentThread().name}")
        }
        launch(newSingleThreadContext("MyOwnThread")) { // will get its own new thread
            println("newSingleThreadContext: I'm working in thread ${Thread.currentThread().name}")
        }
    }
}

fun coroutineTest5() {
    val scope1 = CoroutineScope(Dispatchers.Default)
    suspend fun fun1() {
        println("fun1-1-0 ${currentCoroutineContext()[CoroutineName]}")
        coroutineScope {
            println("coroutineScope1-0 ${coroutineContext[CoroutineName]}")
            val job = launch(CoroutineName("coroutine2")) {
                println("launch3-0 ${coroutineContext[CoroutineName]}")// co
                delay(100)
                println("launch3-1 ${coroutineContext[CoroutineName]}")// co
            }
            println("coroutineScope1-1 ${coroutineContext[CoroutineName]}")
//            job.cancel()
            println("coroutineScope1-2 ${coroutineContext[CoroutineName]}")
            delay(100)
            println("coroutineScope1-3 ${coroutineContext[CoroutineName]}")
        }
        println("fun1-1-1 ${currentCoroutineContext()[CoroutineName]}")
        delay(100)
        println("fun1-1-2 ${currentCoroutineContext()[CoroutineName]}")
    }

    println("coroutineTest5 ${Thread.currentThread()}")

    runBlocking(CoroutineName("coroutine1") + Dispatchers.Default) {
        var this1 = this
        println("0 ${coroutineContext[CoroutineName]} ${Thread.currentThread()}")
        val job = launch {
            var this2 = this
            println("launch1-0 ${coroutineContext[CoroutineName]}")// context of the parent, main runBlocking coroutine
            launch {
                var this3 = this// context of the parent, main runBlocking coroutine
                println("launch2-0 ${coroutineContext[CoroutineName]} ${Thread.currentThread()}")// co
                delay(100)
                println("launch2-1 ${coroutineContext[CoroutineName]}")// co
            }
            println("launch1-1 ${coroutineContext[CoroutineName]}")
            fun1()
            println("launch1-2 ${coroutineContext[CoroutineName]}")
        }
        println("1 ${coroutineContext[CoroutineName]}")
        job.join()
        println("2 ${coroutineContext[CoroutineName]}")
        withContext(Dispatchers.IO) {
            println("withContext IO ${coroutineContext[CoroutineName]} ${Thread.currentThread()}")
        }

        println("3 ${coroutineContext[CoroutineName]}")
    }
}

fun coroutineTest6() {
    runBlocking {
        val res = suspendCancellableCoroutine<Int> { continuation ->
            thread {
//                if (Math.random() > 0.5) {
//                    continuation.resume(1)
//                } else {
//                    continuation.resumeWithException(RuntimeException("xxx"))
//                }
            }
        }
    }
}

fun coroutineTest7() {
    println("coroutineTest7 ${Thread.currentThread()}")
    val scope = CoroutineScope(Dispatchers.Default);
    val res = scope.async {
        println("async1 ${Thread.currentThread()}")
        3
    }
}

fun coroutineCancelTest1() {
    runBlocking {
        val job = launch(Dispatchers.Default) {
            repeat(5) { i ->
                try {
                    // print a message twice a second
                    println("job: I'm sleeping $i ...")
                    delay(500)
                } catch (e: Exception) {
                    // log the exception
                    println(e)
                }
            }
        }
        delay(1300L) // delay a bit
        println("main: I'm tired of waiting!")
        job.cancelAndJoin() // cancels the job and waits for its completion
        println("main: Now I can quit.")
    }
}