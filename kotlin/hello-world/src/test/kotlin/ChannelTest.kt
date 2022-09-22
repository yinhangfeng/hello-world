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

    @Test
    fun test2() = runBlocking {
        val channel = Channel<Int>()

        launch {
            for (x in 0..10) {
                if (!channel.isClosedForSend) {
                    channel.send(x)
                    delay(100)
                }
            }
        }

        launch {
            println("channel receive start")
            try {
                for (d in channel) {
                    println("channel receive: $d")
                }
                println("channel receive complete")
            } catch (e: Throwable) {
                println("channel receive error $e")
                throw e
            }
        }

        delay(500)
//        channel.cancel(CancellationException("xxx"))
//        channel.close()
//        channel.close(CancellationException("xxx"))
        channel.close(RuntimeException("xxx"))
        delay(1000)
    }
}