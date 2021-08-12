#include <stdio.h>
#include <emscripten/emscripten.h>

int main() {
    printf("Hello World\n");
}

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE int myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
    return 1234;
}

#ifdef __cplusplus
}
#endif
