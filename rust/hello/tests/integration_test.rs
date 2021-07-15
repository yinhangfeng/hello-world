use std::borrow::BorrowMut;
use std::rc::Rc;
use std::sync::{Arc, Mutex};
use std::thread;

mod common;

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

#[test]
fn test1() {
    common::setup();
    assert_eq!(4, 4);
}

#[test]
fn it_works() {
    assert_eq!(2 + 2, 4);
}

#[test]
fn test_string() {
    let s1 = String::from("123abc中文");
    println!("s1: {} len: {}", s1, s1.len());
}

#[test]
fn test_struct() {
    let user1 = build_user(String::from("xxx"), String::from("111"));
    let user2 = User {
        email: String::from("another@example.com"),
        username: String::from("anotherusername567"),
        ..user1
    };

    println!("user2 {:#?}", user2);
}

#[test]
fn test_rc1() {
    let mut rc1 = Rc::new(String::from("111"));
    // 为什么不能 rc1.strong_count() ? TODO
    println!("rc1: {} rc1.strong_count: {}", rc1, Rc::strong_count(&rc1));

    let rc1_clone1 = rc1.clone();
    println!("rc1_clone1: {} rc1_clone1.strong_count: {}", rc1_clone1, Rc::strong_count(&rc1_clone1));

    {
        // rc1 是一个智能指针，获取 rc1 的借用相当于指向指针的指针
        let rcb1 = &mut rc1;

        // 错误 rc1 已被可变借用，需要在 rcb1 生命周期结束之后才能再使用
        // println!("rc1: {} rc1.strong_count: {}", rc1, Rc::strong_count(&rc1));
        
        let rc2 = Rc::new(String::from("222"));
        println!("rc2: {} rc2.strong_count: {}", rc2, Rc::strong_count(&rc2));
        // 修改了 rcb1 指向的内容，也就是 rc1 内存地址的值
        // rc1 内存地址原来的值也就是智能指针指针 Rc 会析构引用计数减1
        *rcb1 = rc2;

        // 错误 rc2 已被 move
        // println!("rc2: {}", rc2);

        println!("rcb1: {} rcb1.strong_count: {}", rcb1, Rc::strong_count(&rcb1));
    }

    println!("rc1: {} rc1.strong_count: {}", rc1, Rc::strong_count(&rc1));
    println!("rc1_clone1: {} rc1_clone1.strong_count: {}", rc1_clone1, Rc::strong_count(&rc1_clone1));

    fn fn1(rcb2: &mut Rc<String>) {
        let rc3 = Rc::new(String::from("333"));
        println!("rc3: {} rc3.strong_count: {}", rc3, Rc::strong_count(&rc3));
        *rcb2 = rc3;

        // 错误 rc3 已被 move
        // println!("rc3: {}", rc3);

        println!("rcb2: {} rcb2.strong_count: {}", rcb2, Rc::strong_count(&rcb2));
    }

    fn1(&mut rc1);

    println!("rc1: {} rc1.strong_count: {}", rc1, Rc::strong_count(&rc1));
    println!("rc1_clone1: {} rc1_clone1.strong_count: {}", rc1_clone1, Rc::strong_count(&rc1_clone1));
}

#[test]
fn test_rc2() {
    let mut rc1 = Rc::new(String::from("111"));
    println!("rc1: {}", rc1);

    let rc2 = rc1;

    println!("rc2: {}", rc2);
}
