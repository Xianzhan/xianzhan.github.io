# Python 基础

## 规范

[PEP 8 – Style Guide for Python Code](https://peps.python.org/pep-0008/)<br>
[PEP 8 – Python 代码风格指南](https://peps.pythonlang.cn/pep-0008/)<br>

## 关键字

```py
>>> import keyword
>>> print(keyword.kwlist)
[
    'False', 'None', 'True', 
    'and', 'as', 'assert', 'async', 'await', 
    'break', 
    'class', 'continue', 
    'def', 'del', 
    'elif', 'else', 'except', 
    'finally', 'for', 'from', 
    'global', 
    'if', 'import', 'in', 'is', 
    'lambda', 
    'nonlocal', 'not', 
    'or', 
    'pass', 
    'raise', 'return', 
    'try', 
    'while', 'with', 
    'yield'
]
```

## 注释

```py
>>> # 单行注释


>>> '''多行字符串, 但没有赋值, 也可以用作多行注释
...
... 多行注释
... 多行注释
... 多行注释
... '''
'多行字符串, 但没有赋值, 也可以用作多行注释\n多行注释\n多行注释\n多行注释\n'
```

## 变量

```py
>>> a = 1          # 变量 a 为数字
>>> b = 3.14       # 变量 b 为浮点数
>>> c = 2+3j       # 变量 c 为复数
d = 'Hello Python' # 变量 d 为文本/字符串
```

## 数字

```py
>>> 1 + 2 # 加法
3
>>> 2 - 3 # 减法
-1
>>> 3 * 4 # 乘法
12
>>> 4 / 5 # 除法
0.8
>>> 5 % 6 # 取余
5
>>> 6 // 7 # 向下取整
0
>>> 7 ** 8 # 乘方
5764801
>>> 4 * 3.14 -1 # 混合运算, 转浮点数计算
11.56
```

## 字符串

```py
>>> 'hello'       # 单引号
'hello'
>>> "hello"       # 双引号
'hello'
>>> 'he' + 'llo'  # + 合并
'hello'
>>> 'he' 'llo'    # 空格合并
'hello'

# 多行字符串
>>> '''he
... llo'''
'he\nllo'
>>> """he
... llo"""
'he\nllo'
```

## 列表

```py
>>> s = [1, 2, 3, 4, 5]
>>> s
[1, 2, 3, 4, 5]
```

## 控制流

### `if`

```py
>>> if True:
...     print('true')
...
true


>>> num = input('输入一个数字: ')
输入一个数字: 3
>>> if num == 0:
...     print('0')
... elif num == 1:
...     print('1')
... else:
...     print('其他数字')
...
其他数字
```

### `match`

> @since 3.10 [PEP 636 – Structural Pattern Matching: Tutorial](https://peps.python.org/pep-0636/)<br>

```py
>>> p = (3, 4)
>>> match p:
...     case (0, 0):
...         print('原点')
...     case (0, y):
...         print('在 y 轴上')
...     case (x, 0):
...         print('在 x 轴上')
...     case (x, y):
...         print(f'x={x}, y={y}')
...     case _:
...         print('不是一个点')
...
x=3, y=4
```

### `for`

```py
>>> s = [1, 2, 3, 4, 5]
>>> for n in s:
...     print(n)
...
1
2
3
4
5


>>> for i in range(5):
...     print(i)
...
0
1
2
3
4
```

### `while`

```py
>>> a, b = 0, 1
>>> while a < 100:
...     print(a, end=',')
...     a, b = b, a+b
...
>>> 1,2,3,5,8,13,21,34,55,89,
```

## 函数

```py
>>> def main():
...     print('hello world')
...
>>> main()
hello world
```
