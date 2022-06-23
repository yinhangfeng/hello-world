# 排序

# https://docs.python.org/zh-cn/3/howto/sorting.html

from functools import cmp_to_key


l = [36, 5, -12, 9, -21]

# sorted 不会改变原数组,返回新数组。且可接受任意可迭代对象
result = sorted(l)
print(result)

result = l[:]
# sort 会改变数组
result.sort()
print(result)


def key1(v):
    return abs(v)


# key 参数用于将列表中的元素转换为排序的键，sort 内部用 key 函数返回的键进行比较
result = sorted(l, key=key1)
print(result)
result = sorted(l, key=key1, reverse=True)
print(result)

# python2 提供了与其它语言类似的 cmp 参数，用于将两个元素进行比较
# l.sort(cmp: lambda item1, item2: item1 - item2)

# 可以用 functools.cmp_to_key 将 cmp 函数转换为 key
l.sort(key=cmp_to_key(lambda item1, item2: item1 - item2))

# key 相对于 cmp 是一种更基本的方式，效率也更高
