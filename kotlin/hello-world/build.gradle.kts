val kotlinVersion: String by extra("1.7.20")
val ktorVersion: String by extra("2.1.2")
val kotlinCoroutinesVersion: String by extra("1.6.4")
val exposedVersion: String by extra("0.39.2")
val h2Version: String by extra("1.4.200")

plugins {
    kotlin("jvm") version "1.7.20"
    application
    kotlin("plugin.serialization") version "1.7.20"
}

group = "me.yinhf"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
    jcenter()
//    maven("https://dl.bintray.com/ricky12awesome/github")
}

dependencies {
    testImplementation(kotlin("test"))
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-dao:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("com.h2database:h2:$h2Version")
    implementation("com.github.Ricky12Awesome:json-schema-serialization:0.6.6")
}

tasks.test {
    useJUnitPlatform()
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    // https://kotlinlang.org/docs/gradle.html#compiler-options
    kotlinOptions.jvmTarget = JavaVersion.VERSION_17.toString()
}

application {
    mainClass.set("MainKt")
}