import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import kotlin.test.Test

class Misc1Test {
    @Test
    fun testCoroutine1() {
        coroutineTest5()
    }

    @Test
    fun testCoroutine2() {
        runBlocking {
            val job = launch {
                println("launch start")
                try {
                    delay(5000)
                } catch (e: Exception) {
                    println("delay error: $e")
                }
                println("launch end isActive: $isActive")
            }

            delay(1000)
            job.cancel(CancellationException("xxx"))
            job.join()
            println("end")
        }
    }

    @Test
    fun testFlow1() {
//        flowTest1()
//        flowTest2()
    }

    @OptIn(DelicateCoroutinesApi::class)
    @Test
    fun testChannel1() {
        val channel = Channel<Int>()

        runBlocking {
            // channel 可以在多个线程上接收数据，但每个数据只会有一个线程接收到
            launch(Dispatchers.IO) {
                for (data in channel) {
                    println("launch1 receive: $data ${Thread.currentThread().name}")
                }
            }
            launch(newSingleThreadContext("my_thread1") + CoroutineName("coroutine1")) {
                for (data in channel) {
                    println("launch2 receive: $data ${Thread.currentThread().name}")
                }
            }

            var i = 0
            while (i++ < 10) {
                delay(200)
                channel.send(i)
            }

            delay(1000)
            channel.close()
        }
    }
}