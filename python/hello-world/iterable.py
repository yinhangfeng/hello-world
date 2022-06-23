# 迭代器
from collections.abc import Iterable
from collections.abc import Iterator

# Iterable
d = {'a': 1, 'b': 2, 'c': 3}
l = [1, 2, 3, 4]
s = 'abc'

print(isinstance(d, Iterable))
print(isinstance(l, Iterable))
print(isinstance(s, Iterable))

for key in d:
    print(key, d[key])

for value in d.values():
    print(value)

for key, value in d.items():
    print(key, value)

for value in l:
    print(value)

for index, value in enumerate(l):
    print(index, value)

print(isinstance((x for x in range(10)), Iterator))
