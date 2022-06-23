package hello

import (
	"fmt"
	"sort"
)

// 将[]string定义为MyStringList类型
type MyStringList []string

// 实现sort.Interface接口的获取元素数量方法
func (m MyStringList) Len() int {
	return len(m)
}

// 实现sort.Interface接口的比较元素方法
func (m MyStringList) Less(i, j int) bool {
	return m[i] < m[j]
}

// 实现sort.Interface接口的交换元素方法
func (m MyStringList) Swap(i, j int) {
	m[i], m[j] = m[j], m[i]
}

// 排序方式1: 为类型实现排序接口 sort.Interface 进行排序
func sortMyStringListTest() {
	// 准备一个内容被打乱顺序的字符串切片
	names := MyStringList{
		"3. Triple Kill",
		"5. Penta Kill",
		"2. Double Kill",
		"4. Quadra Kill",
		"1. First Blood",
	}
	// 使用sort包进行排序
	sort.Sort(names)
	// 遍历打印结果
	for _, v := range names {
		fmt.Printf("%s\n", v)
	}
}

// 排序方式2: 内置了常用的数组类型排序方式 sort.Ints sort.Strings...
func sortInner() {
	ints := []int{2, 3, 4, 1}
	sort.Ints(ints)
	// 遍历打印结果
	for _, v := range ints {
		fmt.Printf("%d\n", v)
	}

	names := []string{
		"3. Triple Kill",
		"5. Penta Kill",
		"2. Double Kill",
		"4. Quadra Kill",
		"1. First Blood",
	}
	sort.Strings(names)
	// 遍历打印结果
	for _, v := range names {
		fmt.Printf("%s\n", v)
	}
}

// 声明英雄的分类
type HeroKind int

// 定义HeroKind常量, 类似于枚举
const (
	None HeroKind = iota
	Tank
	Assassin
	Mage
)

// 定义英雄名单的结构
type Hero struct {
	Name string   // 英雄的名字
	Kind HeroKind // 英雄的种类
}

// 排序方式3:  对任意 slice 类型，提供比较函数进行排序
func sortHerosTest() {
	heros := []*Hero{
		&Hero{"吕布", Tank},
		&Hero{"李白", Assassin},
		&Hero{"妲己", Mage},
		&Hero{"貂蝉", Assassin},
		&Hero{"关羽", Tank},
		&Hero{"诸葛亮", Mage},
	}

	sort.Slice(heros, func(i, j int) bool {
		if heros[i].Kind != heros[j].Kind {
			return heros[i].Kind < heros[j].Kind
		}
		return heros[i].Name < heros[j].Name
	})
	for _, v := range heros {
		fmt.Printf("%+v\n", v)
	}
}

func sortTest() {
	sortMyStringListTest()
	sortInner()
	sortHerosTest()
}
