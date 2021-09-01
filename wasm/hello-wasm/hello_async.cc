#include <stdio.h>
#include <iostream>
#include <pthread.h>
#include <unistd.h>
#include <emscripten.h>

typedef void (*callback_func)(const int);

void *thread_func(void *callback)
{
    std::cout << "thread start: " << std::endl;
    sleep(1);
    std::cout << "thread end: " << std::endl;

    // 不允许跨线程调用 js 函数指针
    // ((callback_func) callback)(123);
    return NULL;
}

void _test_async_callback(int arg1, callback_func callback)
{
    std::cout << "_test_async_callback arg1: " << arg1 << std::endl;

    pthread_t th1;
    pthread_create(&th1, NULL, thread_func, (void *)callback);
    // pthread_join(th1, NULL);
    while(pthread_tryjoin_np(th1, NULL)) {
        printf("waiting...\n");
        emscripten_sleep(300);
    }
    callback(123);
}

#ifdef __cplusplus
extern "C"
{
#endif

    EMSCRIPTEN_KEEPALIVE int test_async()
    {
        int i = 10;
        while (--i)
        {
            printf("sleeping...\n");
            emscripten_sleep(300);
        }

        return 123;
    }

    EMSCRIPTEN_KEEPALIVE void test_async_callback(int arg1, callback_func callback)
    {
        _test_async_callback(arg1, callback);
    }

#ifdef __cplusplus
}
#endif

void func(int aaa)
{
}

int main()
{
    test_async_callback(1, &func);
}
