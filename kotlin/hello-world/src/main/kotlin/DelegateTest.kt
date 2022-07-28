private var topLevelInt: Int = 0

class ClassWithDelegate(val anotherClassInt: Int)

class MyClass(var memberInt: Int, val anotherClassInstance: ClassWithDelegate) {
    var delegatedToMember: Int by this::memberInt
    var delegatedToTopLevel: Int by ::topLevelInt

    val delegatedToAnotherClass: Int by anotherClassInstance::anotherClassInt
}

var MyClass.extDelegated: Int by ::topLevelInt

class MutableUser(val map: MutableMap<String, Any?>) {
    var name: String by map
    var age: Int by map
}

fun testDelegate1() {
    var aaa = MyClass(1, ClassWithDelegate(2))
    aaa.delegatedToMember = 1;

    var x = MyClass::class
    x.isData

    var y = MyClass::memberInt
    var b = aaa::memberInt
    b.get()
    b.set(1)
//    var c = ::topLevelInt

}


