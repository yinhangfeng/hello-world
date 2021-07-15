https://doc.rust-lang.org/book/ch01-03-hello-cargo.html

## note

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
// 不返回值的函数 可以认为其返回值为空元组 '()' (unit 类型)

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
// String 是一个 Vec<u8> 的封装 是以 UTF8 编码存储的 不支持索引访问
// 如果需要向其它语言一样的 unicode 存储方式的字符串可以使用 chars()
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

let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");

let s = s1 + "-" + &s2 + "-" + &s3;
let s = format!("{}-{}-{}", s1, s2, s3);


//// 结构体
#[derive(Debug)]
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
// 通过注解 #[derive(Debug)] 允许打印
println!("{:#?}", user1);
// .. 必须放在最后 且之后不能有 ","  与 js 不同 不会覆盖已赋值的值
let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    ..user1
};

// 元组结构体
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);

//// 方法
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}
// 第一个参数为 self 一般为 &self &mut self 一般不会直接为 self 通常用在当方法将 self 转换成别的实例的时候 防止调用者在转换之后使用原始的实例
let r = Rectangle { width: 1, height: 2 };
r.area();
// 等价于 隐式借用
(&r).area();

// 关联函数 在结构体 impl 不以 self 作为第一个参数的函数 相当于其他语言的静态类函数
String::from

//// 枚举
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}
// 创建枚举成员实例
let q = Message::Quit;
// 带数据的枚举成员 与结构体很像
let m = Message::Move { x: 1, y: 2 };

//// Option rust 没有 null
enum Option<T> {
    Some(T),
    None,
}

let some_number = Some(5);
let some_string = Some("a string");
let absent_number: Option<i32> = None;

//// match
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    // 通配符 相当于 default
    _ => (),
}

// 可以认为 if let 是 match 的一个语法糖
match coin {
    Coin::Quarter(state) => println!("State quarter from {:?}!", state),
    _ => count += 1,
}

if let Coin::Quarter(state) = coin {
    println!("State quarter from {:?}!", state);
} else {
    count += 1;
}

//// 模块系统
mod sound {
    pub mod instrument {
        pub fn clarinet() {
        }
    }
}

mod performance_group {
    // 重导出
    pub use crate::sound::instrument;

    pub fn clarinet_trio() {
        instrument::clarinet();
        instrument::clarinet();
        instrument::clarinet();
    }
}

fn main() {
    performance_group::clarinet_trio();
    performance_group::instrument::clarinet();
}

// 引用模块
// 当前项目绝对路径
crate::xxx
// 库名开始(当前项目名)绝对路径
std::xxx
// 相对于当前模块
self::xxx
// 相对于父模块
super::xxx

// 嵌套路径来消除大量的 use 行
use std::{cmp::Ordering, io};
// 引入 std::io 和 std::io::Write
use std::io::{self, Write};
// 引入 collections 内所有 pub
use std::collections::*;

//// vector
let v: Vec<i32> = Vec::new();
let v = vec![1, 2, 3];

let v = vec![1, 2, 3, 4, 5];

let third: &i32 = &v[2];
println!("The third element is {}", third);
// get 允许超出边界
match v.get(2) {
    Some(third) => println!("The third element is {}", third),
    None => println!("There is no third element."),
}

//// trait 类似其它语言的 interface
// 只有当 trait 或者要实现 trait 的类型位于 crate 的本地作用域时，才能为该类型实现 trait

// 类似继承
pub trait Test {
    fn test() -> String;
}

pub struct User {
    pub name: String,
}
impl Test for User {
    fn test() -> String {
        String::from("xxx")
    }
}

// 默认实现
// 类似 java interface
// 覆盖之后不能调用原默认实现

// 表示实现了 Summary trait 的类型  impl Summary (这个一个语法糖)
pub fn notify(item: impl Summary) {
    println!("Breaking news! {}", item.summarize());
}
// Trait Bounds
pub fn notify<T: Summary>(item: T) {
    println!("Breaking news! {}", item.summarize());
}
pub fn notify<T: Summary + Display>(item: T) {}
fn some_function<T: Display + Clone, U: Clone + Debug>(t: T, u: U) -> i32 {}
fn some_function<T, U>(t: T, u: U) -> i32
    where T: Display + Clone,
          U: Clone + Debug
{}


//// 生命周期
// 生命周期语法是用于将函数的多个参数与其返回值的生命周期进行关联的
# fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
#     if x.len() > y.len() {
#         x
#     } else {
#         y
#     }
# }
#
fn main() {
    let string1 = String::from("long string is long");

    {
        let string2 = String::from("xyz");
        let result = longest(string1.as_str(), string2.as_str());
        println!("The longest string is {}", result);
    }
}

//
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    // 方法返回值 自动获得与 &self 相同的生命周期 announcement 拥有不同的生命周期 所以不能返回 announcement
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

//// 闭包
let test = |x| a
let test = |x: u32, y: i32| -> i32 { y }
// Fn FnMut FnOnce trait
Fn(u32) -> u32

//// 迭代器 Iterator
let v1: Vec<i32> = vec![1, 2, 3];

let v2: Vec<_> = v1.iter().map(|x| x + 1).collect();

//// 解引用 Deref trait *
use std::ops::Deref;

# struct MyBox<T>(T);
impl<T> Deref for MyBox<T> {
    type Target = T;

    fn deref(&self) -> &T {
        &self.0
    }
}

*y
*(y.deref())

//// 函数和方法的隐式解引用强制多态
// 当所涉及到的类型定义了 Deref trait，Rust 会分析这些类型并使用任意多次 Deref::deref 调用以获得匹配参数的类型。这些解析都发生在编译时，所以利用解引用强制多态并没有运行时惩罚！

// Rust 在发现类型和 trait 实现满足三种情况时会进行解引用强制多态：
// 当 T: Deref<Target=U> 时从 &T 到 &U。
// 当 T: DerefMut<Target=U> 时从 &mut T 到 &mut U。
// 当 T: Deref<Target=U> 时从 &mut T 到 &U。

```

## 测试

集成测试放在与 src 同级的 tests 目录中，rust 会自动寻找

运行所有测试
```
cargo test
```

运行单个测试(#[test])标记的函数名
```
cargo test foo_test
```

运行单个文件里的所有测试
```
cargo test --test foo_file
```

运行测试时保留 println
```
cargo test -- --nocapture
```
