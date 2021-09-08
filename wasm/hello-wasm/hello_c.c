#include <emscripten/emscripten.h>
#include <stdio.h>

// #ifdef __cplusplus
// extern "C" {
// #endif

EMSCRIPTEN_KEEPALIVE int my_func1(int argc, char** argv) {
  printf("my_func1 called\n");
  return 1234;
}

// #ifdef __cplusplus
// }
// #endif
