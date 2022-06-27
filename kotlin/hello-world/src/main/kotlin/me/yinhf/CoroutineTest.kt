package me.yinhf

import kotlinx.coroutines.*
import kotlin.system.measureTimeMillis

fun coroutineTest1() {
    // this is your first suspending function
    suspend fun doWorld() {
        delay(1000L)
        println("World!")
    }

    suspend fun test1() {
        coroutineScope {  // this: CoroutineScope
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