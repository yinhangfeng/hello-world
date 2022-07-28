package test


interface Key1 {

}

interface Key2 {

}

class OperatorTest1 {
    operator fun get(aaa: Key1): Int {
        return 1
    }
}

class KeyCls1 {
    companion object Key11 : Key1
}

fun operatorTest1() {
    val test1 = OperatorTest1()
    // https://kotlinlang.org/docs/object-declarations.html#companion-objects
    val x = test1[KeyCls1]
    val k: Key1 = KeyCls1
}