import kotlinx.coroutines.*
import kotlinx.coroutines.channels.Channel
import java.lang.RuntimeException
import kotlin.coroutines.CoroutineContext
import kotlin.test.Test

class CoroutineTest {
    @Test
    fun testCoroutineScope1() {
        runBlocking {
            var launch1: Job? = null
            launch1 = launch(Dispatchers.Default) {
                // launch 的 CoroutineScope 就是 Coroutine 本身同时也是 launch 返回的 Job
                println("launch1 ${this === launch1}")

                val launch2 = launch {
                    println("launch2 isActive: $isActive")
                    delay(100)
                    println("launch2 end")
                }

                println("launch1 cancel")
                // 父子 Coroutine 的 cancel 之后子 Coroutine 也会被 cancel
                cancel()
                println("launch1 isActive: $isActive")

                // 父级已经取消的情况下，使用 launch 带上 Job 还是可以启动 Coroutine
                // 相当于该 Coroutine 与父级没有关系
                val launch3 = launch(Job()) {
                    println("launch3 isActive: $isActive")
                    delay(100)
                    println("launch3 end isActive: $isActive")
                }
            }
            println("testCoroutineScope1 isActive: $isActive")
            // launch1 已经 cancel, 不会等待 launch3，所以这里手动等待一下，否则测试用例结束之后 launch3 也会被取消
            delay(1000)
        }
        println("testCoroutineScope1 end")
    }

    @Test
    fun testCoroutineScope2() {
        runBlocking {
            val scope1 = MyCoroutineScope(Dispatchers.Default + Job())

            scope1.cancel()

            // 同 testCoroutineScope1
            // 手动创建的 CoroutineScope 被 cancel 之后，仍旧可以使用 Job 强行启动
            val launch1 = scope1.launch(Job()) {
                println("launch1 $isActive")
                delay(100)
                println("launch1 end $isActive")
            }

            launch1.join()
        }
        println("testCoroutineScope2 end")
    }

    @Test
    fun testCoroutineScope3(): Unit = runBlocking {
        val scope1 = MyCoroutineScope(Dispatchers.Default)

        val launch1 = scope1.launch {
            println("launch1 $isActive")
            delay(100)
            println("launch1 end $isActive")
        }

        println("cancel")
        // 没有 Job 的 Coroutine 不能执行 cancel
        // 但由这个 scope 启动的 launch 是一个 Job 可以 cancel
//        scope1.cancel()
        launch1.cancel()
    }

    @Test
    fun testCoroutineScope4() {
        runBlocking {
            val scope1 = MyCoroutineScope(Dispatchers.Default + Job())
            // 将 scope1 的 Job 作为 scope2 的父级 Job，则在 scope1 被取消之后 scope2 也会被取消
            val scope2 = MyCoroutineScope(Dispatchers.Default + Job(scope1.coroutineContext[Job]))

            val launch1 = scope1.launch {
                println("launch1 $isActive")
                delay(100)
                println("launch1 end $isActive")
            }

            val launch2 = scope2.launch {
                println("launch2 $isActive")
                delay(100)
                println("launch2 end $isActive")
            }

            println("cancel")
            scope1.cancel()

            launch1.join()
            launch2.join()
        }

        println("testCoroutineScope4 end")
    }

    @Test
    fun testChannel() {
        val channel = Channel<Int>()

        runBlocking {
            val launch1 = launch {
                println("launch1")
                try {
                    // 在 channel.send 阻塞时可以被取消
                    channel.send(1)
                } catch (e: Exception) {
                    println("launch1 send error $e")
                    throw e
                }
                println("launch1 end")
            }

            delay(100)
            println("cancel launch1")
            launch1.cancel()
        }
    }
}

class MyCoroutineScope(override val coroutineContext: CoroutineContext) : CoroutineScope
