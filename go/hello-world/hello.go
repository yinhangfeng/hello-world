package hello

import (
	"fmt"

	"rsc.io/quote"
)

func main() {

	// 声明一个变量并初始化
	var a = "RUNOOB"
	fmt.Println(a)

	// 没有初始化就为零值
	var b int
	fmt.Println(b)

	// bool 零值为 false
	var c bool
	fmt.Println(c)

	d := 1

	e := 2

	e, d = d, e

	var (
		f = 1
		g = "gg"
		h int
	)

	fmt.Println(f, g, h)

	const C1 int = 1
	const C2 = 2

	const (
		C3 = 3
		C4 = "c4"
		C5 = 5
	)

	quote.Hello()
}
