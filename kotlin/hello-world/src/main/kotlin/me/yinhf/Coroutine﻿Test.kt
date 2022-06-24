package me.yinhf

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

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
            job.join()
            println("Done")
        }
    }

    runBlocking { // this: CoroutineScope
        test1()
    }
}

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