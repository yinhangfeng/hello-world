#include <stdio.h>
#include <my_lib/my_lib.h>
#include "hello_thread.h"

#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>

using namespace emscripten;
#endif

int main() {
    printf("Hello World %d\n", my_lib_func1());

    // test_thread1();
}

float lerp(float a, float b, float t)
{
    return (1 - t) * a + t * b;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(my_module)
{
    function("lerp", &lerp);
    function("test_thread1", &test_thread1);
}
#endif
