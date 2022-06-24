package me.yinhf

fun test1() {
    functionLiteralsWithReceiver { v ->
        // Function literals with receiver 无法访问 receiver 中 protected 和 private 成员
//        println("$c $d")
        println("functionLiteralsWithReceiver callback $a $b $aaa")
        v + 1
    }

    // 使用匿名函数达到与 lambda 等价效果
    functionLiteralsWithReceiver(fun(test1: Test1, v: Int): Int {
        println("functionLiteralsWithReceiver callback ${test1.a} ${v}")
        return 2
    })

//    functionLiteralsWithReceiver(object : Test1() {
//        override operator fun invoke(v: Int): Int {
//            println("functionLiteralsWithReceiver callback")
//            return v + 1
//        }
//    })

    samCallback { v ->
        println("samCallback callback")
        v + 1
    }

    samCallback(fun(v: Int): Int {
        println("functionLiteralsWithReceiver callback")
        return v + 1
    })

//    samCallback(object : Test1() {
//        override operator fun invoke(v: Int): Int {
//            println("functionLiteralsWithReceiver callback")
//            return v + 1
//        }
//    })

    val fun1 = object : Test1() {
        override fun invoke(v: Int): Int {
            println("functionLiteralsWithReceiver callback")
            return v + 1
        }
    }

    samCallback(fun1::invoke)

    val fun2 = ITest1 {
        println("functionLiteralsWithReceiver callback")
        it + 1
    }

    samCallback(fun2::invoke)
}


fun main(args: Array<String>) {
    // Try adding program arguments via Run/Debug configuration.
    // Learn more about running applications: https://www.jetbrains.com/help/idea/running-applications.html.
    println("Program arguments: ${args.joinToString()}")
//    val name = readln()
//    println("Hello, $name!")

    test1()

//    var a: String? = ""
//
//    var b = a?.length ?: -1
//    var c = a!!.length
//    var d = c as? Int


}