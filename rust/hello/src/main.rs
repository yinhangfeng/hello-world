fn main() {
    println!("Hello, world!");

    five();

    let tu = empty();

    let sl = {
        let s = String::from("aaa");
        &s[..]
    };

    println!("sl:{}", sl);
}

fn five() -> i32 {
    5
}

fn empty() {

}
