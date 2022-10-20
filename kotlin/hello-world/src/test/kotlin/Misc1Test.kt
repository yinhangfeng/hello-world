import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import java.lang.RuntimeException
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
                    delay(1000)
                } catch (e: Exception) {
                    println("delay1 error: $e")
                }
                try {
                    delay(1000)
                } catch (e: Exception) {
                    println("delay2 error: $e")
                }
                println("launch end isActive: $isActive")
            }

            println("launch job: $job isActive: ${job.isActive} isCompleted: ${job.isCompleted} isCancelled: ${job.isCancelled}")

            delay(500)
            job.cancel(CancellationException("xxx"))
            println("launch job after cancel: $job isActive: ${job.isActive} isCompleted: ${job.isCompleted} isCancelled: ${job.isCancelled}")
            job.join()
            println("end")
        }
    }

    @Test
    fun testCoroutine3() {
        runBlocking {
//            val scopeJob = Job()
            // 如果使用 SupervisorJob 则某个子的 launch 异常不会导致整个 scope 结束
            val scopeJob = SupervisorJob()
            var context = Dispatchers.Default + scopeJob + CoroutineName("test")
            context += CoroutineExceptionHandler { context, err ->
                println("coroutine err: $err ${Thread.currentThread().name} $context")
            }
            val mainTestScope =
                CoroutineScope(context)

            val job1 = mainTestScope.launch {
                println("launch1 ${Thread.currentThread().name}")
                delay(400)
                println("launch1 throw")
                // mainTestScope 的子 job 发生异常，整个 mainTestScope 会被 cancel 除非使用 SupervisorJob
                // launch 内抛出异常如果没有 CoroutineExceptionHandler 会输出红色异常信息，但程序不会崩溃
                throw RuntimeException("error1")
            }

            val job2 = mainTestScope.launch {
                println("launch2 ${Thread.currentThread().name}")
                delay(800)
                println("launch2 end")
            }

            val deferred1 = mainTestScope.async {
                println("async1 ${Thread.currentThread().name}")
                delay(500)
                println("async1 throw")
                // async 内抛出异常可以在 deferred1.await() 上捕获，在 CoroutineExceptionHandler 中无法捕获
                // 就算不捕获程序也不会崩溃
                throw RuntimeException("error2")
            }

            try {
                deferred1.await()
            } catch (e: Exception) {
                println("deferred1 error $e")
            }

            println("testCoroutine3 delay ${Thread.currentThread().name}")
            delay(2000)

//            mainTestScope.cancel()

            // 如果 mainTestScope 已经因为异常而结束，则无法再 launch
            mainTestScope.launch {
                println("launch3 ${Thread.currentThread().name}")
                delay(800)
                println("launch3 end")
            }

            delay(2000)
            println("testCoroutine3 end")
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