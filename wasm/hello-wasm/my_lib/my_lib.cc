#include "my_lib.h"

#include <emscripten/emscripten.h>
#include <stdio.h>

int my_lib_func1() {
  printf("my_lib_func1\n");
  return 1;
}

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE int my_lib_func2(int argc, char** argv) {
  printf("my_lib_func2 called\n");
  return 1234;
}

#ifdef __cplusplus
}
#endif
