#include <iostream>
#include <thread>
#include <mutex>

int cnt = 0;
std::mutex m;
void thread_func()
{
    std::cout << "thread start: " << std::this_thread::get_id() << std::endl;
    for (int i = 0; i < 10; ++i)
    {
        // std::lock_guard<std::mutex> lock(m);
        m.lock();
        ++cnt;
        std::cout << "thread loop: " << i << " cnt: " << cnt << " thread_id: " << std::this_thread::get_id() << std::endl;
        m.unlock();
        std::this_thread::sleep_for(std::chrono::microseconds(1));
    }
    std::cout << "thread end: " << std::this_thread::get_id() << std::endl;
}

void test_thread1()
{
    std::cout << "test_thread1" << std::endl;
    cnt = 0;
    std::thread th1(thread_func);
    std::cout << "th1: " << th1.get_id() << std::endl;
    std::thread th2(thread_func);
    std::cout << "th2: " << th2.get_id() << std::endl;

    th1.join();
    th2.join();

    std::cout << "test_thread1 end cnt: " << cnt << std::endl;
}

// int main() {
//     test_thread1();
// }
