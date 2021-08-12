#include <stdio.h>
#ifdef __EMSCRIPTEN__
#include <emscripten/bind.h>
using namespace emscripten;
#endif

void test_file1()
{
    FILE *fp = NULL;
    fp = fopen("/test.txt", "w+");
    fprintf(fp, "This is testing for fprintf...\n");
    fputs("This is testing for fputs...\n", fp);
    fclose(fp);
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(my_module_file)
{
    function("test_file1", &test_file1);
}
#endif
