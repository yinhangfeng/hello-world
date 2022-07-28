import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun flowTest1() {
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            Thread.sleep(100) // pretend we are computing it in CPU-consuming way
            println("Emitting $i ${Thread.currentThread()}")
            emit(i) // emit next value
        }
    }.flowOn(Dispatchers.Default) // RIGHT way to change context for CPU-consuming code in flow builder

    println("flowTest1 ${Thread.currentThread()}")
    runBlocking<Unit> {
        simple().collect { value ->
            println("Collected $value  ${Thread.currentThread()}")
        }
    }
}

fun flowTest2() {
    fun simple(): Flow<Int> = flow {
        for (i in 1..3) {
            delay(100)
            println("Emitting $i")
            emit(i)
        }
    }

    val flow1 = simple().buffer().map {
        it * it
    }

    runBlocking<Unit> {
        launch {
            flow1.collect {
                println("flow collect $it")
            }
        }
        println("xxx")
        withTimeoutOrNull(250) { // Timeout after 250ms
            flow1.collect {
                println("flow withTimeoutOrNull collect $it")
            }
        }
        println("Done")
    }
}