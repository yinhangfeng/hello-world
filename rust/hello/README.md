```rust
//// 风格
// 缩进4个空格
// 使用 snake case

// cargo doc --open 本地打开当前项目所有依赖的文档

// Shadowing
// Result

// parameter: 形参  argument: 实参

//// 标识符
// 单独 _ 不能作为标识符
// 原始标识符 r#
let r#fn = "xxx";
// 调用名为 'match' 的函数
r#match();

// panic 表示因为错误而退出

// 支持像 python 一样表示 byte 数据
b'adfadf'

//// 元组
let tup: (i32, f64, u8) = (500, 6.4, 1);
let (x, y, z) = tup;
tup.0
tup.1

//// 数组
// 长度不可变 如果需要像其他语言一样的可变的 需要使用 vector
// 空间分配在栈上

// 数组的类型
let a: [i32; 5] = [1, 2, 3, 4, 5];
a[0];
a[1];

//// range
(1..4)
// 反转
(1..4).rev()

//// 函数
// 必须定义形参类型和返回值类型(如果有返回值的话 不会自动类型推到)
// 可以通过 return 返回 也可以通过最后一个表达式作为返回值
fn five() -> i32 {
    5
}
// 不返回值的函数 可以认为其返回值为空元组 '()'

//// 表达式
// 代码块定义的表达式
{
    let x = 3;
    x + 1
}
// 最后一个语句没有分号 表达式的值为 x + 1 = 4

//// if
// 不需要括号
// if 是表达式
let number = if condition {
    5
} else {
    6
};

//// 循环
// loop 无条件循环
// 循环是一个表达式 break 后面可以跟表达式(像 return) 表示循环的返回值
let result = loop {
    counter += 1;

    if counter == 10 {
        break counter * 2;
    }
};
// for
// 不支持大部分语言中的 for(; i < 10; ++i)
let a = [10, 20, 30, 40, 50];

for element in a.iter() {
    println!("the value is: {}", element);
}


//// String
// 被分配在堆上
// 通过字符串字面值获取
let s = String::from("hello");
// 字符串字面值是 slice

//// 所有权（ownership）
// 离开作用域时 drop
// 函数返回值的所有权会移交给调用者
// 移动 move
let s1 = String::from("hello");
let s2 = s1;
// 移动 clone
let s1 = String::from("hello");
let s2 = s1.clone();

// 对于栈上的类型 赋值时使用 Copy 原变量仍有效 (Copy trait)
let s1 = String::from("hello");
let s2 = s1.clone();

//// 引用与借用
// 引用没有所有权
fn test(s: &String) -> usize {
  s.len()
}
let s1 = String::from("hello");
let len = test(s1);

// 可变引用
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
// 当可变引用被不可变借用之后 其本身也变得不可变
let mut s = String::from("xxx");
s.push_str("111");
let s1 = &s;
s.push_str("222"); // 错误
println!("s{} s1{}", s, s1);

// 在特定作用域中的特定数据有且只有一个可变引用。这些代码会失败：
// 也不能在拥有不可变引用的同时拥有可变引用
fn main() {
    let mut s = String::from("hello");

    change(&mut s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
// slice 没有所有权


//// 结构体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}
fn build_user(email: String, username: String) -> User {
    // 初始化 顺序可以不同 同名变量简化
    User {
        email,
        username,
        active: true,
        sign_in_count: 1,
    }
}
let user1 = build_user();
let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    ..user1
};
```