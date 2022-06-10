# pass 空语句 代替其它语言的 ;
if True:
    pass

# 循环
for num in range(2, 10):
    if num % 2 == 0:
        print("Found an even number", num)
        continue
    print("Found an odd number", num)


# match

def http_error(status):
    match status:
        case 400:
            return "Bad request"
        case 404:
            return "Not found"
        case 418:
            return "I'm a teapot"
        case 401 | 403 | 404:
            return "Not allowed"
        case _:
            return "Something's wrong with the internet"


http_error(401)


def match_point(point):
    match point:
        case (0, 0):
            print("Origin")
        case (0, y):
            print(f"Y={y}")
        case (x, 0):
            print(f"X={x}")
        case (x, y):
            print(f"X={x}, Y={y}")
        case _:
            raise ValueError("Not a point")


match_point((1, 0))


# 格式化字符串

str1 = "abc"
str2 = f"111{ str1   =   :}"
print(str2)


