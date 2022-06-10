d = {'a': 1, 'b': 2, 'c': 3}
l = [1, 2, 3, 4]
s = 'abc'

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
