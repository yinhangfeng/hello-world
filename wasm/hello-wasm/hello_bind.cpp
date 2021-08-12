#include <stdio.h>
#include <emscripten/bind.h>

using namespace emscripten;

int main() {
    printf("Hello World\n");
}

float lerp(float a, float b, float t)
{
    // embind 内的 printf 没法输出?
    printf("lerp(%f, %f, %f)", a, b, t);
    return (1 - t) * a + t * b;
}

EMSCRIPTEN_BINDINGS(my_module)
{
    function("lerp", &lerp);
}

class MyClass
{
public:
    MyClass(int x, std::string y)
        : x(x), y(y)
    {
    }

    void incrementX()
    {
        ++x;
        printf("incrementX");
    }

    int getX() const { return x; }
    void setX(int x_)
    {
        x = x_;
        printf("setX");
    }

    static std::string getStringFromInstance(const MyClass &instance)
    {
        return instance.y;
    }

private:
    int x;
    std::string y;
};

// Binding code
EMSCRIPTEN_BINDINGS(my_class_example)
{
    class_<MyClass>("MyClass")
        .constructor<int, std::string>()
        .function("incrementX", &MyClass::incrementX)
        .property("x", &MyClass::getX, &MyClass::setX)
        .class_function("getStringFromInstance", &MyClass::getStringFromInstance);
}
