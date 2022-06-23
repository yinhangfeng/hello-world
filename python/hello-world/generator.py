# 生成器

from typing import Generator

# 用类似列表生成式方式创建 generator  把 [] 换成 ()
g = (x * x for x in range(10))
for n in g:
    print(n)


# generator 函数
def fib(max):
    n, a, b = 0, 0, 1
    while n < max:
        yield b
        a, b = b, a + b
        n = n + 1
    return 'done'


# for 循环无法获取 generator 函数的返回值
for n in fib(6):
    print(n)

# 手动迭代 处理 StopIteration
g = fib(6)
while True:
    try:
        x = next(g)
        print('g:', x)
    except StopIteration as e:
        print('Generator return value:', e.value)
        break
