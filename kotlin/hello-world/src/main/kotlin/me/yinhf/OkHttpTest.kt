package me.yinhf

import okhttp3.OkHttpClient
import okhttp3.Request
import okio.IOException

object OkHttpTest {
    fun test1() {
        val client = OkHttpClient()
        val request = Request.Builder().url("https://example.com").build()
        try {
            val response = client.newCall(request).execute()
            response.use {
                val text = response.body?.string()
                println("test1: $text")
            }
        } catch (e: IOException) {
            e.printStackTrace()
        }
    }
}