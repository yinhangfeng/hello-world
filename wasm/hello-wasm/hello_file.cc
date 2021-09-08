#include <stdio.h>
#include <unistd.h>

#include <iostream>
#ifdef __EMSCRIPTEN__
// #include <emscripten/bind.h>
#include <emscripten/emscripten.h>
// using namespace emscripten;
#endif

#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE void test_file1() {
  FILE *fp = NULL;
  fp = fopen("/test.txt", "w+");
  fprintf(fp, "This is testing for fprintf...\n");
  fputs("This is testing for fputs...\n", fp);
  fclose(fp);
}

EMSCRIPTEN_KEEPALIVE void test_file_stdin1() {
  char buf[1024];
  // STDIN_FILENO
  int ret = read(0, buf, sizeof(buf));

  std::cout << "test_file_stdin1: " << buf << " ret: " << ret << std::endl;
  // 为啥 printf 无法显示到 console
  //   printf("test_file_stdin1: %s ret: %d", buf, ret);
}

#ifdef __cplusplus
}
#endif

// #ifdef __EMSCRIPTEN__
// EMSCRIPTEN_BINDINGS(my_module_file) {
//   function("test_file1", &test_file1);
// //   function("test_file_stdin1", &test_file_stdin1);
// }
// #endif
