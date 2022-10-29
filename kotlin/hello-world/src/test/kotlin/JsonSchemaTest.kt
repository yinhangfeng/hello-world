import kotlinx.serialization.Serializable
import com.github.ricky12awesome.jss.*
import com.github.ricky12awesome.jss.JsonSchema.*
import kotlinx.serialization.SerialName
import kotlinx.serialization.json.Json
import kotlin.test.Test

class JsonSchemaTest {
    @Test
    fun test1() {
        val jsonSchema = buildJsonSchema(Config.serializer(), generateDefinitions = false)
        println(jsonSchema)
        val jsonSchemaStr = Json.encodeToSchema(Config.serializer(), generateDefinitions = false)
        println(jsonSchemaStr)
    }
}

@Serializable
abstract class BaseConfig() {
    @Description(["baseA baseA"])
    abstract val baseA: String
    abstract val baseB: String
}

@Serializable
data class Config(
    // override 之后 Config.serializer() 里父类的 Annotation 也会被覆盖掉,
    // 如果不 override 的话没法给父类该属性复制, Serializable 不允许构造函数有普通参数
    override val baseA: String = "aaa",
    override val baseB: String = "bbb",
    @Description(["Name for this project."])
    val name: String = "",
    val xxx: String,
    val xxx1: String?,
    val xxx2: String? = null,
//    @Description(["Theme for this project."])
//    val theme: Theme = Theme()
) : BaseConfig()

@Serializable
sealed class ThemeColor {
    @Serializable
    @SerialName("HEX")
    data class HEX(
        @Pattern("#[0-9a-fA-F]{2,6}") val hex: String
    ) : ThemeColor()

    @Serializable
    @SerialName("RGB")
    data class RGB(
        @JsonSchema.IntRange(0, 255) val r: Int,
        @JsonSchema.IntRange(0, 255) val g: Int,
        @JsonSchema.IntRange(0, 255) val b: Int
    ) : ThemeColor()

    @Serializable
    @SerialName("HSV")
    data class HSV(
        @JsonSchema.IntRange(1, 360) val h: Int,
        @FloatRange(0.0, 1.0) val s: Double,
        @FloatRange(0.0, 1.0) val v: Double
    ) : ThemeColor()

    @Serializable
    @SerialName("HSL")
    data class HSL(
        @JsonSchema.IntRange(1, 360) val h: Int,
        @FloatRange(0.0, 1.0) val s: Double,
        @FloatRange(0.0, 1.0) val l: Double
    ) : ThemeColor()
}

@Serializable
data class Theme(
    @Description(["Primary color for this theme."]) @Definition("ThemeColor")
    val primary: ThemeColor = ThemeColor.RGB(128, 128, 128),
    @Description(["Secondary color for this theme."]) @Definition("ThemeColor")
    val secondary: ThemeColor = ThemeColor.HSV(0, 0.0, 0.3),
    @Description(["Accent color for this theme."]) @Definition("ThemeColor")
    val accent: ThemeColor = ThemeColor.HSL(0, 0.0, 0.8),
    @Description(["Background color for this theme."]) @Definition("ThemeColor")
    val background: ThemeColor = ThemeColor.HEX("#242424")
)
