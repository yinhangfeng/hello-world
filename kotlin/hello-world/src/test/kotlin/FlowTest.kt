import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlin.test.Test

class FlowTest {
    @Test
    fun testSharedFlow() = runBlocking {
        val flow = MutableSharedFlow<Int>()

        launch {
            println("emit start")
            for (i in 0..9) {
                flow.emit(i)
            }
            println("emit end")
        }

        println("before collect")
        flow.collect {
            println("collect $it")
        }
        println("after collect")
    }
}