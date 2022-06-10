# 列表生成式

list1 = [x * x for x in range(1, 11)]
print(list1)

list2 = [m + n for m in 'ABC' if m != 'A' for n in 'XYZ' if n != 'X']
print(list2)

# 其实就是把循环写到一行里，等价于
list22 = []
for m in 'ABC':
    if m != 'A':
        for n in 'XYZ':
            if n != 'X':
                v = m + n
                list22.append(v)
print(list22)

list3 = [x * x if x % 2 == 0 else -x for x in range(1, 11)]
print(list3)
