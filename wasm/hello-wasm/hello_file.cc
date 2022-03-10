#include <pthread.h>
#include <stdio.h>
#include <time.h>
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

EMSCRIPTEN_KEEPALIVE void test_file2() {
  FILE *fp = NULL;
  fp = fopen("/test/test.txt", "r+");
  char buf[1024];
  int ret = fread(buf, sizeof(char), sizeof(buf), fp);
  std::cout << "test_file2: " << buf << " ret: " << ret << std::endl;
  fclose(fp);
}

EMSCRIPTEN_KEEPALIVE void test_file_stdin1() {
  char buf[1024];
  // 0: STDIN_FILENO
  int ret = read(0, buf, sizeof(buf));

  std::cout << "test_file_stdin1: " << buf << " ret: " << ret << std::endl;
  // 为啥 printf 无法显示到 console
  //   printf("test_file_stdin1: %s ret: %d", buf, ret);
}

EMSCRIPTEN_KEEPALIVE void test_pipe() {
  int n;
  int filedes[2];
  char buffer[1025];
  char *message = "Hello, World!";

  pipe(filedes);
  write(filedes[1], message, strlen(message));

  if ((n = read(filedes[0], buffer, 1024)) >= 0) {
    buffer[n] = 0;  // terminate the string
    // printf("read %d bytes from the pipe: %s ", n, buffer);
    std::cout << "read bytes from the pipe: " << buffer << std::endl;
  } else
    perror("read");
}

EMSCRIPTEN_KEEPALIVE void test_pipe1(int fd) {
  int n;
  char buffer[1025];

  n = read(fd, buffer, 1024);
  if (n == 2147483647) {
    std::cout << "read 0 bytes from the pipe"
              << " ret: " << n << std::endl;
  } else if (n >= 0) {
    buffer[n] = 0;  // terminate the string
    std::cout << "read bytes from the pipe: " << buffer << " ret: " << n
              << std::endl;
    // printf("read %d bytes from the pipe: %s ", n, buffer);
  } else
    // perror("read");
    std::cout << "read bytes from the pipe "
              << " ret: " << n << std::endl;
}

static void *thread_func(void *param) {
  int fd = (int)param;
  std::cout << "thread start: " << std::this_thread::get_id() << std::endl;

  int n;
  char buffer[1025];

  while ((n = read(fd, buffer, 1024)) == 2147483647) {
    // 模拟阻塞, wasm 下必须在线程中才可以,否则阻塞主线程
    // 50ms
    nanosleep((const struct timespec[]){{0, 50000000L}}, NULL);
  }

  if (n >= 0) {
    buffer[n] = 0;  // terminate the string
    std::cout << "read bytes from the pipe: " << buffer << " ret: " << n
              << std::endl;
    // printf("read %d bytes from the pipe: %s ", n, buffer);
  } else
    // perror("read");
    std::cout << "read bytes from the pipe "
              << " ret: " << n << std::endl;

  std::cout << "thread end: " << std::this_thread::get_id() << std::endl;

  return NULL;
}

EMSCRIPTEN_KEEPALIVE void test_pipe2(int fd) {
  pthread_attr_t attr;
  pthread_attr_init(&attr);
  pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);
  pthread_t thread;
  pthread_create(&thread, &attr, thread_func, (void *)fd);
  pthread_attr_destroy(&attr);
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
