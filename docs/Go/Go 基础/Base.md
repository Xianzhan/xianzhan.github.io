# Go 基础

## 环境

```sh
$ go version
go version go1.24.4 windows/amd64
```

## Hello world

```sh
$ mkdir hello
$ cd hello
$ go mod init github.com/xianzhan/hello
$ code .
```

创建 hello.go 文件:
```go
package main

import "fmt"

func main() {
	fmt.Println("Hello, World!")
}
```

然后执行命令:
```sh
$ go run .
Hello, World!
```

## pkg.go.dev

添加依赖 [`quote`](https://pkg.go.dev/rsc.io/quote), 编写代码：
```go
package main

import (
	"fmt"

	"rsc.io/quote"
)

func main() {
	fmt.Println(quote.Go())
}

```

若此时执行:
```sh
$ go run .
hello.go:6:2: no required module provides package rsc.io/quote; to add it:
        go get rsc.io/quote
```

这是因为未下载该 package, 此时我们需要执行下面这个命令修复这个问题:
```sh
$ go mod tidy
go: finding module for package rsc.io/quote
go: downloading rsc.io/quote v1.5.2
go: found rsc.io/quote in rsc.io/quote v1.5.2
go: downloading rsc.io/sampler v1.3.0
go: downloading golang.org/x/text v0.0.0-20170915032832-14c0d48ead0c
```

再次执行:
```sh
$ go run .
Don't communicate by sharing memory, share memory by communicating.
```

## 变量

`var` 声明一个或多个变量, 编译器可推断初始化变量的类型. `:=` 语法是声明和初始化变量, 仅在函数内部可用.

```go
package main

import "fmt"

func main() {

    var a = "initial"
    fmt.Println(a)

    var b, c int = 1, 2
    fmt.Println(b, c)

    var d = true
    fmt.Println(d)

    var e int
    fmt.Println(e)

    f := "apple"
    fmt.Println(f)
}
```

## 常量

`const` 声明一个常量, 支持字符、字符串、布尔值和数值的常量. `const` 语句可以出现在任何 `var` 的地方. **数字常量没有类型**, 除非通过显示转换等方式赋予类型.

```go
package main

import (
    "fmt"
    "math"
)

const s string = "constant"

func main() {
    fmt.Println(s)

    const n = 500000000

    const d = 3e20 / n
    fmt.Println(d)

    fmt.Println(int64(d))

    fmt.Println(math.Sin(n))
}
```

## 内置类型

- `bool`: 布尔类型, 值只有 `true` 和 `false`
- `byte`(`uint8`): 字节类型
- `rune`(`int32`): 字符类型
- `int8`: 8 位整数类型
- `int16`: 16 位整数类型
- `int32`: 32 位整数类型
- `int64`: 64 位整数类型
- `uint8`: 8 位无符号整数类型
- `uint16`: 16 位无符号整数类型
- `uint32`: 32 位无符号整数类型
- `uint64`: 64 位无符号整数类型
- `float32`: 32 位浮点数类型
- `float64`: 64 位浮点数类型
- `complex64`: 32 位浮点数 + 复数
- `complex128`: 64 位浮点数 + 复数
- `string`: 字符串

## 控制流

**if**
```go
package main

import "fmt"

func main() {

    if 7%2 == 0 {
        fmt.Println("7 is even")
    } else {
        fmt.Println("7 is odd")
    }

    if 8%4 == 0 {
        fmt.Println("8 is divisible by 4")
    }

    if 8%2 == 0 || 7%2 == 0 {
        fmt.Println("either 8 or 7 are even")
    }

    if num := 9; num < 0 {
        fmt.Println(num, "is negative")
    } else if num < 10 {
        fmt.Println(num, "has 1 digit")
    } else {
        fmt.Println(num, "has multiple digits")
    }
}
```

**switch**
```go
package main

import (
    "fmt"
    "time"
)

func main() {

    i := 2
    fmt.Print("Write ", i, " as ")
    switch i {
    case 1:
        fmt.Println("one")
    case 2:
        fmt.Println("two")
    case 3:
        fmt.Println("three")
    }

    switch time.Now().Weekday() {
    case time.Saturday, time.Sunday:
        fmt.Println("It's the weekend")
    default:
        fmt.Println("It's a weekday")
    }

    t := time.Now()
    switch {
    case t.Hour() < 12:
        fmt.Println("It's before noon")
    default:
        fmt.Println("It's after noon")
    }

    whatAmI := func(i interface{}) {
        switch t := i.(type) {
        case bool:
            fmt.Println("I'm a bool")
        case int:
            fmt.Println("I'm an int")
        default:
            fmt.Printf("Don't know type %T\n", t)
        }
    }
    whatAmI(true)
    whatAmI(1)
    whatAmI("hey")
}
```

**for**
```go
package main

import "fmt"

func main() {

    i := 1
    for i <= 3 {
        fmt.Println(i)
        i = i + 1
    }

    for j := 0; j < 3; j++ {
        fmt.Println(j)
    }

    for i := range 3 {
        fmt.Println("range", i)
    }

    for {
        fmt.Println("loop")
        break
    }

    for n := range 6 {
        if n%2 == 0 {
            continue
        }
        fmt.Println(n)
    }
}
```

## 函数

```go
package main

import "fmt"

func plus(a int, b int) int {

    return a + b
}

func plusPlus(a, b, c int) int {
    return a + b + c
}

// 多返回值
func vals() (int, int) {
    return 3, 7
}

// 可变参数函数
func sum(nums ...int) {
    fmt.Print(nums, " ")
    total := 0

    for _, num := range nums {
        total += num
    }
    fmt.Println(total)
}

func main() {

    res := plus(1, 2)
    fmt.Println("1+2 =", res)

    res = plusPlus(1, 2, 3)
    fmt.Println("1+2+3 =", res)

    // 多返回值调用
    a, b := vals()
    fmt.Println(a)
    fmt.Println(b)

    // 忽略第一个返回值
    _, c := vals()
    fmt.Println(c)

    // 可变参数函数调用
    sum(1, 2)
    sum(1, 2, 3)
    nums := []int{1, 2, 3, 4}
    sum(nums...)
}
```

## 闭包

Go 支持匿名函数, 它可以构成闭包.

```go
package main

import "fmt"

func intSeq() func() int {
    i := 0
    return func() int {
        i++
        return i
    }
}

func main() {

    nextInt := intSeq()

    fmt.Println(nextInt())
    fmt.Println(nextInt())
    fmt.Println(nextInt())
    // 1
    // 2
    // 3

    newInts := intSeq()
    fmt.Println(newInts())
    // 1
}
```
