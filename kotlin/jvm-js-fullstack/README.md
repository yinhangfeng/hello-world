[![official JetBrains project](https://jb.gg/badges/official.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)
[![GitHub license](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg?style=flat)](https://www.apache.org/licenses/LICENSE-2.0)

# Full Stack JVM & JS App Hands-On Lab

This repository is the code corresponding to the hands-on lab [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/).

**The master branch is to be used as a template. If you would like to see the completed project, check out the [final](https://github.com/kotlin-hands-on/jvm-js-fullstack/tree/final) branch.**


## 笔记
https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction
```
运行
./gradlew run

构建发布
ORG_GRADLE_PROJECT_isProduction=true ./gradlew stage

构建产物
./build/install/shoppinglist

运行 ./build/install/shoppinglist/bin/shoppinglist
```


前后端一体开发
后端服务除了提供api接口，还充当了前端的资源服务器

构建之后前端资源文件与后端代码全部包含在了 jar 文件里，不太适合实际生产使用

kotlin 结合 react 函数式组件的写法还是不错的
