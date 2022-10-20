class AnnotationTest {
    fun test1() {
    }
}



@Target(AnnotationTarget.PROPERTY)
annotation class FieldAnnotation1(
//    val type: String = "",
    val title: String = "",
    val description: String = "",
    val required: Boolean = true,
)
