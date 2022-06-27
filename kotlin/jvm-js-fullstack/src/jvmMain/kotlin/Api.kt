import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.serialization.kotlinx.json.*

val jsonClient = HttpClient(CIO) {
    install(ContentNegotiation) {
        json()
    }
}

suspend fun getShoppingList(): List<ShoppingListItem> {
    return jsonClient.get("http://127.0.0.1" + ShoppingListItem.path).body()
}
