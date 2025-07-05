# 字符串

## String

```java
// 推荐
String str = "Hello world";
// 不推荐
String strWithNew = new String("Hello world");

// 字符串拼接
String a = "a";
String b = "b";
String ab = a + b;
```

### 文本块

> @since 13 [JEP 355: Text Blocks (Preview)](https://openjdk.org/jeps/355)<br>
> @since 14 [JEP 368: Text Blocks (Second Preview)](https://openjdk.org/jeps/368)<br>
> @since 15 [JEP 378: Text Blocks](https://openjdk.org/jeps/378)<br>

```java
var json = """
        {
          "name": "Java 16",
          "features": [
            "文本块"
          ]
        }
        """;
```

## StringBuilder

若字符串拼接在一个循环作用域里, 可以使用 `StringBuilder` 拼接提升性能.

```java
StringBuilder builder = new StringBuilder();
for (int i = 0; i < 10; i++) {
    builder.append(i);
}
// builder: "0123456789"
```