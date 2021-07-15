use rand::Rng;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    println!("Hello, world!");

    println!("capacity_to_buckets(): {}", capacity_to_buckets(999999999999999999).unwrap());

    let a: u8 = 0xf0;
    println!("aaa: {}", a);
    println!("aaa: {}", a.rotate_left(4));

    fn equal_to_x(z: i32) -> bool {
        z == 3
    }

    equal_to_x(4);

    let aa = equal_to_x;

    aa(5);

    let mut x = 5;
    let y = Box::new(x);

    println!("x{} y{}", x, y);

    x = 6;
    println!("x{} y{}", x, y);

    let a = MyBox(3);

    println!("{}", a.0);

    // let mut x = 5;
    // let y = &mut x;
    // println!("x{} y{}", x, y);

    test_thread();
}

fn test_thread() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}

fn capacity_to_buckets(cap: usize) -> Option<usize> {
    let adjusted_cap = if cap < 8 {
        // Need at least 1 free bucket on small tables
        cap + 1
    } else {
        // Otherwise require 1/8 buckets to be empty (87.5% load)
        //
        // Be careful when modifying this, calculate_layout relies on the
        // overflow check here.
        cap.checked_mul(8)? / 7
    };

    // Any overflows will have been caught by the checked_mul. Also, any
    // rounding errors from the division above will be cleaned up by
    // next_power_of_two (which can't overflow because of the previous divison).
    Some(adjusted_cap.next_power_of_two())
}

struct MyBox(i32);

fn test_hash_map() {
    let text = "hello world wonderful world";

    let mut map = HashMap::new();

    for word in text.split_whitespace() {
        // 简洁写法 同时符合借用规则
        let count = map.entry(word).or_insert(0);
        *count += 1;

        // 像大部分语言那样的写法 会由于借用规则而很麻烦
        // let v = map.get(word);
        // if let Some(v1) = v {
        //     map.insert(String::from(word), v1 + 1);
        // } else {
        //     map.insert(word.to_string(), 0);
        // }
    }

    println!("testHashMap {:#?}", map);
}

fn largest<T: PartialOrd + Copy>(list: &[T]) -> T {
    let mut largest = list[0];

    for &item in list.iter() {
        if item > largest {
            largest = item;
        }
    }

    largest
}

fn test_largest() {
    let number_list = vec![34, 50, 25, 100, 65];

    let result = largest(&number_list);
    println!("The largest number is {}", result);
}

// impl<T: PartialOrd> ToString for T {
//     fn aaa() {
//     }
// }

struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}
