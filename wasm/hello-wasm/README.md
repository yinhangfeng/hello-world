## 配置EMSDK 环境

https://emscripten.org/docs/getting_started/downloads.html
```
git clone https://github.com/emscripten-core/emsdk.git path/to/emsdk
export EMSDK=path/to/emsdk
source $EMSDK/emsdk_env.sh

emsdk install latest
emsdk activate latest

# 调试 emsdk 命令可以加上该环境变量
export EMCC_DEBUG=1
```

## 简单例子

编译导出 js 与 html(默认模板只能用于测试没什么用)
```
emcc hello.c -o out/hello.html
```

## 编译导出 umd 模块，参考 hello2.html 引入，也可使用 npm 模块方式引入
使用 EMSCRIPTEN_KEEPALIVE 宏导出函数
```
emcc hello_module.c -s MODULARIZE=1 -s EXPORT_NAME=HelloModule -o out/hello_module.js
```
MODULARIZE=1 指定导出模块(umd)
EXPORT_NAME=HelloModule 指定了导出的模块名为 HelloModule
输出文件的简单使用方式查看 hello_module.html

## 使用 embind
```
emcc hello_bind.cpp --bind -s MODULARIZE=1 -s EXPORT_NAME=HelloBind -o out/hello_bind.js
```
hello_bind.html

## cmake 工程

```
cd out
emcmake cmake ..
emmake make
```
hello_cmake.html

## 文件系统
https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api
hello_file.cc 已包括在 cmake 工程
hello_cmake.html

构建时打包文件 https://emscripten.org/docs/porting/files/packaging_files.html

#### Packaging Files
https://emscripten.org/docs/porting/files/packaging_files.html

```
emcc hello_file.cc --bind -s MODULARIZE=1 -s EXPORT_NAME=HelloFile -o out/hello_file.js --embed-file assets
emcc hello_file.cc --bind -s MODULARIZE=1 -s EXPORT_NAME=HelloFile -o out/hello_file.js --preload-file assets
```

## 多线程
https://emscripten.org/docs/porting/pthreads.html
需要给 emcc 添加 -pthread 参数，网站需要开启 COOP COEP (配置在 serve.json 中)
https://web.dev/coop-coep/
https://developer.chrome.com/blog/enabling-shared-array-buffer/

如果网站无法开启 COOP COEP 则可以使用 origin-trial token 仅限 chrome 92-103
<meta http-equiv="origin-trial" content="TOKEN_GOES_HERE">
https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial

## 异步
```
emcc hello_async.cc -s MODULARIZE=1 -s EXPORT_NAME=HelloAsync -s EXPORTED_RUNTIME_METHODS="[ccall,cwrap,addFunction]" -s ASYNCIFY -s ALLOW_TABLE_GROWTH -sPTHREAD_POOL_SIZE=2 -pthread -gsource-map -o out/hello_async.js
```

## Debug
https://emscripten.org/docs/porting/Debugging.html#debug-information
https://developer.chrome.com/blog/wasm-debugging-2020/
emcc 命令中加上 -gsource-map 会生成 sourcemap，可在浏览器调试
cmake 工程中可以设置在 CMAKE_CXX_FLAGS 上

使用 EMCC_DEBUG=1 环境变量可以在 emsdk 编译时输出更多信息

## 参考

- https://developer.mozilla.org/zh-CN/docs/WebAssembly/C_to_wasm
- 构建复杂工程 https://emscripten.org/docs/compiling/Building-Projects.html
- emcc 命令行参数 https://emscripten.org/docs/tools_reference/emcc.html
- -s option 参数 https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
- embind https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#embind
- emscripten 环境预定义的宏 https://emscripten.org/docs/compiling/Building-Projects.html#detecting-emscripten-in-preprocessor
- emscripten cmake 参数传递 https://emscripten.org/docs/getting_started/FAQ.html?highlight=cmake#how-do-i-specify-s-options-in-a-cmake-project
- FAQ https://emscripten.org/docs/getting_started/FAQ.html