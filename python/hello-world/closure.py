# 闭包

# 如果对外层变量赋值，由于Python解释器会把x当作函数fn()的局部变量，它会报错
# 原因是x作为局部变量并没有初始化，直接计算x+1是不行的。但我们其实是想引用inc()函数内部的x，所以需要在fn()函数内部加一个nonlocal x的声明。加上这个声明后，解释器把fn()的x看作外层函数的局部变量，它已经被初始化了，可以正确计算x+1。
def inc():
    x = 0

    def fn():
        nonlocal x
        x = x + 1
        return x
    return fn


f = inc()
print(f())  # 1
print(f())  # 2
