const js = import("@yinhf/hello-wasm-rust/hello_wasm_rust");
js.then(js => {
  js.greet("WebAssembly");
});