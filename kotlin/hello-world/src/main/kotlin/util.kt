typealias IntPredicate = (i: Int) -> Boolean

val isEven: IntPredicate = { it % 2 == 0 }

fun interface ITest1 {
//    var a: Int
//    val b: String

    fun test1() {
        println("ITest1 test1")
    }

    fun invoke(a: Int): Int
}

abstract class AbsTest1 : ITest1 {
    var a = 1
    val b = "b"

    override fun test1() {
        println("AbsTest1 test1")
    }
}

open class Test1(var x: String = "x") : AbsTest1() {
    protected var c = 3
    private var d = 4
    var aaa: Int = 111
        get() = 1
        set(value) {
            // keyword: field
            field = value
        }

    override fun invoke(a: Int): Int {
        return 0
    }
}

// Function literals with receiver
// https://kotlinlang.org/docs/lambdas.html#function-literals-with-receiver
fun functionLiteralsWithReceiver(callback: Test1.(a: Int) -> Int) {
    val test1 = Test1("xx")
    var result = test1.callback(3)
    println("functionLiteralsWithReceiver result $result")
}

// Functional (SAM) interfaces
// https://kotlinlang.org/docs/fun-interfaces.html
fun samCallback(callback: (a: Int) -> Int) {
    var result = callback(3)
    println("samCallback result $result")
}

