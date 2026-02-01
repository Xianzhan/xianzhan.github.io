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

## CAS

CAS（Compare-And-Swap）是一种重要的**无锁并发控制机制**，它通过硬件原子指令支持，实现了高效的多线程数据同步。

CAS 操作包含三个参数：**内存位置（V）**、**预期原值（A）​**和**新值（B）**。其语义是：“我认为位置 V 的值应该是 A，如果是，那么将其更新为 B；否则，不进行任何修改，并告诉我当前的实际值。”​ 这个过程是作为一条硬件级原子指令（如 x86 架构的 `CMPXCHG`）执行的，保证了不可中断性。

**注意**

- **ABA 问题**：CAS 的经典问题：线程 1 读取内存值为 A，之后线程 2 将值修改为 B，然后又修改回 A。随后线程 1 执行 CAS 操作，发现值仍是 A，于是成功更新。但此 “A” 非彼 “A”，中间的状态变化被忽略，可能导致逻辑错误。
  - 解决方案：使用版本号机制。
- **自旋开销**：在高并发且竞争激烈的场景下，多个线程的 CAS 操作可能频繁失败并长时间自旋，导致 CPU 资源空转，消耗大量计算资源。
- **只能保证单变量的原子性**：CAS 操作的对象是单一的共享变量（如一个 `AtomicInteger`）。如果需要同时原子性地更新多个变量，CAS 无法直接实现。此时可以考虑将这些变量封装到一个对象里，然后使用 `AtomicReference` 来更新整个对象引用，或者使用传统的锁机制。

`Unsafe` 提供了一些方法来实现 CAS 操作，包括 `compareAndSwapInt`、`compareAndSwapLong`、`compareAndSwapObject` 等。

::: tip

`Unsafe.compareAndSwapInt(Object, long, int, int)` 的调用链是怎样的？

1. `sun.misc.Unsafe.compareAndSwapInt(Object, long, int, int)`

```java
@Deprecated(since="23", forRemoval=true)
@ForceInline
public final boolean compareAndSwapInt(Object o, long offset,
                                       int expected,
                                       int x) {
    beforeMemoryAccess();
    return theInternalUnsafe.compareAndSetInt(o, offset, expected, x);
}
```

2. `jdk.internal.misc.Unsafe.compareAndSetInt(Object, long, int, int)`
3. [src/hotspot/share/prims/unsafe.cpp](https://github.com/openjdk/jdk/blob/jdk-25%2B0/src/hotspot/share/prims/unsafe.cpp#L753-L757)

```cpp
UNSAFE_ENTRY_SCOPED(jboolean, Unsafe_CompareAndSetInt(JNIEnv *env, jobject unsafe, jobject obj, jlong offset, jint e, jint x)) {
  oop p = JNIHandles::resolve(obj);
  volatile jint* addr = (volatile jint*)index_oop_from_field_offset_long(p, offset);
  return Atomic::cmpxchg(addr, e, x) == e;
} UNSAFE_END
```

4. [src/hotspot/cpu/x86/x86_64.ad](https://github.com/openjdk/jdk/blob/jdk-25%2B0/src/hotspot/cpu/x86/x86_64.ad#L7078-L7096)

```cpp
instruct compareAndSwapI(rRegI res,
                         memory mem_ptr,
                         rax_RegI oldval, rRegI newval,
                         rFlagsReg cr)
%{
  match(Set res (CompareAndSwapI mem_ptr (Binary oldval newval)));
  match(Set res (WeakCompareAndSwapI mem_ptr (Binary oldval newval)));
  effect(KILL cr, KILL oldval);

  format %{ "cmpxchgl $mem_ptr,$newval\t# "
            "If rax == $mem_ptr then store $newval into $mem_ptr\n\t"
            "setcc $res \t# emits sete + movzbl or setzue for APX" %}
  ins_encode %{
    __ lock();
    __ cmpxchgl($newval$$Register, $mem_ptr$$Address);
    __ setcc(Assembler::equal, $res$$Register);
  %}
  ins_pipe( pipe_cmpxchg );
%}
```

:::

## 线程管理

- `Unsafe.park(boolean, long)`: 阻塞当前线程，直到被其他线程唤醒或超时。
- `Unsafe.unpark(Object)`: 唤醒指定线程。

```java
import sun.misc.Unsafe;

void main() throws Exception {
    Field theUnsafe = Unsafe.class.getDeclaredField("theUnsafe");
    theUnsafe.setAccessible(true);
    Unsafe unsafe = (Unsafe) theUnsafe.get(null);

    var t = new Thread(() -> unsafe.park(false, 0L));
    t.setName("parked-thread");
    t.start();
    // "parked-thread" #36 [10168] prio=5 os_prio=0 cpu=0.00ms elapsed=17.73s tid=0x00000214801c6c50 nid=10168 waiting on condition  [0x000000de785ff000]
    //   java.lang.Thread.State: WAITING (parking)
    //        at jdk.internal.misc.Unsafe.park(java.base@25/Native Method)
    //        at sun.misc.Unsafe.park(jdk.unsupported@25/Unsafe.java:1534)
    //        at Main.lambda$main$0(Main.java:8)
    //        at Main$$Lambda/0x0000000096042a10.run(Unknown Source)
    //        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
    //        at java.lang.Thread.run(java.base@25/Thread.java:1474)

    TimeUnit.SECONDS.sleep(120L);
    unsafe.unpark(t);
    TimeUnit.SECONDS.sleep(120L);
}

```
