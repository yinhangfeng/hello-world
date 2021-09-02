dart2js
https://dart.dev/tools/dart2js
dart2js -O0 -o build/hello.js hello.dart


使用 dart compile js 代替 dart2js 但是没法配置 -On
https://dart.dev/tools/dart-compile
dart compile js hello.dart -o build/hello.js
生成压缩文件
dart compile js -m hello.dart -o build/hello.js
