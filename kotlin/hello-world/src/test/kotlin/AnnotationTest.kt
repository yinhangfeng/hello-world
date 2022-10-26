import kotlin.reflect.KProperty1
import kotlin.reflect.full.declaredMemberProperties
import kotlin.reflect.full.findAnnotations
import kotlin.reflect.full.memberProperties
import kotlin.reflect.full.superclasses
import kotlin.test.Test

class AnnotationTest {
    @Test
    fun test1() {
        val aaa = Cls2()
        val aaa1: Cls1 = aaa

//        val c = Cls2::class
        val c = aaa1::class

        c.superclasses

        println(c.declaredMemberProperties)
        println(c.memberProperties)

        c.memberProperties.forEach {
            val p = it as KProperty1<Cls1, *>
            println("p: $it")
            println(it.annotations)
//            println(it.get(aaa as Cls1))
            println(p.get(aaa))
        }

    }
}


@Target(AnnotationTarget.PROPERTY, AnnotationTarget.FIELD)
annotation class TestAnnotation1(
//    val type: String = "",
    val title: String = "",
    val description: String = "",
    val required: Boolean = true,
)

abstract class Cls1(
    @TestAnnotation1(title = "aaa")
    val aaa: Int = 1,
) {
    @TestAnnotation1(title = "bbb")
    val bbb = "bbb"

    @TestAnnotation1(title = "ccc")
    abstract val ccc: String

    fun xxx1() {

    }
}

class Cls2(aaa: Int = 1) : Cls1(aaa) {
    override val ccc: String
        get() = "ccc"

    @TestAnnotation1(title = "ddd")
    val ddd: String
        get() = "ddd"

    fun xxx2() {

    }
}
