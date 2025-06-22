# Java 基础

## 环境

`java -version`
```sh
openjdk version "24" 2025-03-18
OpenJDK Runtime Environment GraalVM CE 24+36.1 (build 24+36-jvmci-b01)
OpenJDK 64-Bit Server VM GraalVM CE 24+36.1 (build 24+36-jvmci-b01, mixed mode, sharing)
```

## Hello world

Hello.java
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```

```sh
java Hello.java
# Hello world
```

## 关键字

**修饰符**
- `public`
- `protected`
- `private`
- `abstract`
- `static`
- `final`
- `transient`
- `volatile`
- `synchronized`
- `native`

**声明**
- `boolean`
- `byte`
- `char`
- `short`
- `int`
- `long`
- `float`
- `double`
- `class`
- `interface`
- `extends`
- `package`
- `throws`
- `implements`
- `enum`: @since 5
- `record`: @since 14
- `sealed`: @since 15
- `permits`: @since 15
- `non-sealed`: @since 15

**控制流**
- `if`
- `else`
- `try`
- `catch`
- `finally`
- `do`
- `while`
- `for`
- `continue`
- `switch`
- `case`
- `default`
- `yield`: @since 14
- `break`
- `throw`
- `return`

**其他**
- `this`
- `new`
- `super`
- `import`
- `instanceof`
- `void`
- `strictfp`
- `assert`
- `goto`
- `const`
- `_`: @since 9
- `var`: @since 10

**字面量**
- `true`
- `false`
- `null`

## 原始类型

|类型|默认值|包装类|虚拟机内部符号|位数|
|---|---|---|---|---|
|`boolean`|`false`|`Boolean`|Z|8|
|`byte`|`0`|`Byte`|B|8|
|`short`|`0`|`Short`|S|16|
|`char`|`\u0000`|`Character`|C|16|
|`int`|`0`|`Integer`|I|32|
|`long`|`0L`|`Long`|J|64|
|`float`|`+0.0F`|`Float`|F|32|
|`double`|`+0.0D`|`Double`|D|64|

## class

```java
public class Human {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## enum

@since 5 `public abstract class Enum<E extends Enum<E>>`

```java
public enum HumanGender {

    MALE("MALE"),
    FEMALE("FEMALE"),
    OTHER("OTHER");

    private final String name;

    HumanGender(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
```

## record

> @since 14 [JEP 359: Records (Preview)](https://openjdk.org/jeps/359)<br>
> @since 15 [JEP 384: Records (Second Preview)](https://openjdk.org/jeps/384)<br>
> @since 16 [JEP 395: Records](https://openjdk.org/jeps/395)

`public abstract class Record`

```java
public record Human(String name, int age) {
}
```

## 控制流

**if**
```java
var r = RandomGenerator.getDefault();
if (r.nextBoolean()) {
    System.out.println("Hello, world!");
} else {
    System.out.println("Goodbye, world!");
}
```

**switch**
```java
var r = RandomGenerator.getDefault();
switch (r.nextInt(0, 2)) {
    case 0:
        System.out.println(0);
        break;
    case 1:
        System.out.println(1);
        break;
    default:
        System.out.println("default");
        break;
}
```

**for**
```java
// for 循环
var array = {0, 1, 2, 3};
for (int i : array) {
    // @since 5 foreach 循环
    System.out.println(i);
}
```

**while**
```java
var r = RandomGenerator.getDefault();
while (r.nextBoolean()) {
    System.out.println("Hello, World!");
}
```