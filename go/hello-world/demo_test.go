package hello

import "testing"

func Test1(t *testing.T) {
	result := demo1(1)
	if result != 1 {
		t.Error("xxx")
	}
}
