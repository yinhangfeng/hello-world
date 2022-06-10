# 函数

# 关键字定义顺序 必选参数、默认参数、可变参数、命名关键字参数(命名关键字参数默认值顺序没有要求)、关键字参数
def func1(a, b=2, *args, kc, kd='d', **kw):
    print(f'func1 a={a} b={b} args={args} c={kc} d={kd} k={kw}')
    # args 是元祖类型 不可变
    # kw 是 dict 类型，可变
    # 外部如果通过 func1(*args, **kw) 调用，调用时 kw 会被复制所以内部的 kw 改变不会影响外部
    kw['aa'] = 1
    kw.pop('aa')


# 如果不需要可变参数但要关键字参数，则需要添加 "*," 用于分隔


def func2(a, b=2, *, kc, kd='d', **kw):
    print(f'func2 a={a} b={b} c={kc} d={kd} k={kw}')


func1(1, kc='c')
func1(1, kd='dd', kc='c')
func1(1, kd='dd', kc='c', xx='xx')
# 调用的时候关键字参数必须在非关键字参数后面
# func1(kd='dd', kc='c', 1)

args = (1, 2, 3, 4)
kw = {'kc': 'c'}
list = [1, 2, 3, 4]

# 可以使用 *args **kw 调用任意函数
# 但 args 参数个数要符合函数要求，kw 中也必须包含没有默认值的命名关键字参数
func1(*args, **kw)
func1(*list, **kw)
