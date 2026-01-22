# Unsafe

## 基本介绍

> @since 23 [JEP 471: Deprecate the Memory-Access Methods in sun.misc.Unsafe for Removal](https://openjdk.org/jeps/471)<br>
> @since 24 [JEP 498: Warn upon Use of Memory-Access Methods in sun.misc.Unsafe](https://openjdk.org/jeps/498)<br>

`sun.misc.Unsafe` （后面称 `Unsafe`）是 Java 提供的一个低级别的操作类，允许直接访问底层系统资源，执行不安全的操作。它提供了许多直接操作内存、线程和类的方法，通常用于性能优化或实现某些特殊功能。

::: tip

如何获取 `Unsafe` 实例?

虽然 `Unsafe` 有一个 `getUnsafe()` 方法，但不能直接用，否则会报 `SecurityException` 异常。

```java
import sun.misc.Unsafe;

void main() {
    Unsafe u = Unsafe.getUnsafe();
    // Exception in thread "main" java.lang.SecurityException: Unsafe
	//     at jdk.unsupported/sun.misc.Unsafe.getUnsafe(Unsafe.java:110)
	//     at Main.main(Main.java:4)
}
```

但我们可以使用反射来获取 `Unsafe` 实例

```java
import sun.misc.Unsafe;

void main() throws Exception {
    Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
    theUnsafe.setAccessible(true);
    Unsafe unsafe = (Unsafe) theUnsafe.get(null);
}
```

:::

::: tip

`jdk.internal.misc.Unsafe` 和 `sun.misc.Unsafe` 的区别?

从 Java 9 开始，`Unsafe` 被标记为废弃，`Unsafe` 内部使用 `jdk.internal.misc.Unsafe` 实现。但又因 [JEP 261: Module System](https://openjdk.org/jeps/261)，普通开发者无法使用 `jdk.internal.misc.Unsafe`，只能使用 `Unsafe`。

```java
import jdk.internal.misc.Unsafe;

void main() throws Exception {
    Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
    theUnsafe.setAccessible(true);
    Unsafe unsafe = (Unsafe) theUnsafe.get(null);
    // Exception in thread "main" java.lang.IllegalAccessError: class Main (in unnamed module @0x3f99bd52) cannot access class jdk.internal.misc.Unsafe (in module java.base) because module java.base does not export jdk.internal.misc to unnamed module @0x3f99bd52
	//     at Main.main(Main.java:4)
}
```

模块 `java.base` 限制了 `jdk.internal.misc` 包的使用范围(JDK 25)

```java
module java.base {
    exports jdk.internal.misc to
        java.desktop,
        java.logging,
        java.management,
        java.naming,
        java.net.http,
        java.rmi,
        java.security.jgss,
        jdk.attach,
        jdk.charsets,
        jdk.compiler,
        jdk.crypto.cryptoki,
        jdk.graal.compiler,
        jdk.incubator.vector,
        jdk.internal.vm.ci,
        jdk.jfr,
        jdk.jshell,
        jdk.nio.mapmode,
        jdk.unsupported;
}
```

:::

## 对象操作

`Unsafe` 提供了一些方法来操作对象，包括创建对象、获取/设置对象头、获取/设置对象字段等。

::: tip

如何获取对象头信息？

可以简单的使用以下代码计算对象头大小

```java
import sun.misc.Unsafe;

void main() throws Exception {
    Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
    theUnsafe.setAccessible(true);
    Unsafe unsafe = (Unsafe) theUnsafe.get(null);

    int intArrayOffset = unsafe.arrayBaseOffset(int[].class);
    IO.println(intArrayOffset);
    // intArrayOffset: 16
}
```

`intArrayOffset` 是数组第一个元素的偏移量，又因为 Java 所有数组对象都有一个 `length` 属性，该属性是 `int` 类型，占用 4 个字节，所以当前 JVM 的对象头大小为 16 - 4 = 12 字节。

:::

::: tip

如何获取对象字段数据？

```java
import sun.misc.Unsafe;

static class People {
    private final int age;

    public People(int age) {
        this.age = age;
    }
}

void main() throws Exception {
    Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
    theUnsafe.setAccessible(true);
    Unsafe unsafe = (Unsafe) theUnsafe.get(null);

    Field ageField = People.class.getDeclaredField("age");
    long ageOffset = unsafe.objectFieldOffset(ageField);
    IO.println(ageOffset);
    // ageOffset: 12

    People p = new People(2026);
    int age = unsafe.getInt(p, ageOffset);
    IO.println(age);
    // age: 2026
}
```

:::
