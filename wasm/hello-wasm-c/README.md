## 配置EMSDK 环境
```
source $EMSDK/emsdk_env.sh
```

## 编译

- 编译导出 js 与 html(默认模板只能用于测试没什么用)
```
emcc hello.c -o out/hello.html
```

- 编译导出 umd 模块，参考 hello3.html 引入，也可使用 npm 模块方式引入
使用 EMSCRIPTEN_KEEPALIVE 宏导出函数
```
emcc hello3.c -s MODULARIZE=1 -s EXPORT_NAME=Hello3 -o out/hello3.js
```
MODULARIZE=1 指定导出模块
EXPORT_NAME=Hello3 指定了导出的模块名为 Hello3
输出文件的简单使用方式查看 out/hello3.html
```
import Hello3 from 'hello3.js';

const hello3 = await Hello3();
hello3._myFunction({
  // 是否不运行 main 函数,默认 false
  noInitialRun: false,
});
// hello3._main() 也可以单独运行 main 参考 option EXPORTED_FUNCTIONS
```

- 使用 embind
```
emcc --bind hello_bind.cpp -s MODULARIZE=1 -s EXPORT_NAME=HelloBind -o out/hello_bind.js
```

## 运行

```
serve out
```

## 参考

https://developer.mozilla.org/zh-CN/docs/WebAssembly/C_to_wasm
构建复杂工程 https://emscripten.org/docs/compiling/Building-Projects.html
emcc 命令行参数 https://emscripten.org/docs/tools_reference/emcc.html
-s option 参数 https://github.com/emscripten-core/emscripten/blob/main/src/settings.js
embind https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#embind