import kotlin.test.*
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import java.lang.RuntimeException
import java.util.concurrent.CancellationException

class ChannelTest {
    @Test
    fun test1() = runBlocking {
        val channel = produce {
            for (x in 0..10) send(x * x)
        }
    }

    @OptIn(ExperimentalCoroutinesApi::class)
    @Test
    fun test2() = runBlocking {
        val channel = Channel<Int>()
        val receiveChannel: ReceiveChannel<Int> = channel

        launch {
            println("channel send start")
            try {
                for (x in 0..10) {
                    println("channel send $x isClosedForSend: ${channel.isClosedForSend}")
                    channel.send(x)
                    delay(50)
                }
                println("channel send completed")
            } catch (e: Exception) {
                println("channel send error $e isClosedForSend: ${channel.isClosedForSend}")
            }
        }

        launch {
            println("channel receive start")
            try {
                for (d in receiveChannel) {
                    println("channel receive: $d")
                    delay(100)
                }
//                while (true) {
//                    val d = receiveChannel.receive()
//                    println("channel receive: $d")
//                    delay(100)
//                }
                println("channel receive complete isClosedForReceive: ${channel.isClosedForReceive}")
            } catch (e: Throwable) {
                println("channel receive error $e isClosedForReceive: ${channel.isClosedForReceive}")
            }
        }

        delay(500)
        println("channel close or cancel")
        // cancel 之后再 send 或者 receive 会报 cancel 异常
//        channel.cancel()
//        channel.cancel(CancellationException("xxx"))
        // close 之后再 send 会报 closed 异常
        // 无参数的 close 之后 receive 会报 ClosedReceiveChannelException 异常
        // 如果在 channel 上迭代则会退出不会报异常
        channel.close()
        // 提供具体异常的 close 之后 receive 或 迭代都会报出具体异常，可以认为是 channel 异常了
//        channel.close(RuntimeException("xxx"))
        delay(1000)
    }
}