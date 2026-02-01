# 同步基础

## synchronized

`synchronized` 关键字是 Java 中实现线程同步的核心工具，它通过一套精密的机制保证了并发编程中至关重要的**原子性**、**可见性**和**有序性**。

核心实现机制

- 原子性：通过 **Monitor**（监视器锁）实现互斥执行，确保同一时刻只有一个线程能进入同步代码块。具体实现，同步代码块前后分别插入 `monitorenter` 和 `monitorexit` 指令
- 可见性：通过锁释放/获取时的内存语义实现，释放锁时强制刷新工作内存到主内存，获取锁时强制从主内存重新加载
- 有序性：通过互斥执行的串行化结合 happens-before 规则和内存屏障实现，限制指令重排序

`synchronized` 是由 JVM 实现的**悲观锁**，锁的信息存在[对象头 markWord](https://github.com/openjdk/jdk/blob/jdk-25%2B0/src/hotspot/share/oops/markWord.hpp#L35) 里。在 64 位的系统中，对象头内存表示如下：

```java
unused:22 hash:31 -->| unused_gap:4  age:4  self-fwd:1  lock:2 (normal object)
```

这里主要看最后两位 lock 的值。

### 锁升级

> @since 15 [JEP 374: Deprecate and Disable Biased Locking](https://openjdk.org/jeps/374)

JVM 中 `monitorenter` 和 `monitorexit` 字节码依赖于底层操作系统的 Mutex Lock 来实现，但 Mutex Lock 需要将当前线程挂起并从用户态切换到内核态来执行，这种执行开销非常大。然而在大部分情况下，同步方法是运行在单线程环境（无锁竞争）。

在 JDK 1.6 的时候，JVM 对 `synchronized` 锁引入了大量的优化，其中就是 `synchronized` 可以根据情况进行升级，减少锁操作的开销。

锁的状态有以下几种：

- 无锁状态：未加锁
- ~~偏向锁（biased lock）~~
- 轻量级锁（thin lock）
- 重量级锁（fat lock）

以下代码展示锁的升级方式：

```java
import java.util.concurrent.TimeUnit;
import org.openjdk.jol.info.ClassLayout;

final Object lock = new Object();

void main() throws Exception {
    IO.println(ClassLayout.parseInstance(lock).toPrintable());
    // java.lang.Object object internals:
    // OFF  SZ   TYPE DESCRIPTION               VALUE
    //   0   8        (object header: mark)     0x0000000000000001 (non-biasable; age: 0)
    //   8   4        (object header: class)    0x001831d0
    //  12   4        (object alignment gap)    
    // Instance size: 16 bytes
    // Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

    Runnable r = () -> {
        synchronized (lock) {
            IO.println(Thread.currentThread().getName());
            IO.println(ClassLayout.parseInstance(lock).toPrintable());
            while (true) ;
        }
    };
    var t1 = new Thread(r);
    t1.start();
    // java.lang.Object object internals:
    // OFF  SZ   TYPE DESCRIPTION               VALUE
    //   0   8        (object header: mark)     0x0000000000000000 (thin lock: 0x0000000000000000)
    //   8   4        (object header: class)    0x001831d0
    //  12   4        (object alignment gap)    
    // Instance size: 16 bytes
    // Space losses: 0 bytes internal + 4 bytes external = 4 bytes total

    TimeUnit.SECONDS.sleep(3L);

    var t2 = new Thread(r);
    t2.start();

    TimeUnit.SECONDS.sleep(3L);

    IO.println(Thread.currentThread().getName());
    IO.println(ClassLayout.parseInstance(lock).toPrintable());
    // java.lang.Object object internals:
    // OFF  SZ   TYPE DESCRIPTION               VALUE
    //   0   8        (object header: mark)     0x00000238cd5ec502 (fat lock: 0x00000238cd5ec502)
    //   8   4        (object header: class)    0x001831d0
    //  12   4        (object alignment gap)    
    // Instance size: 16 bytes
    // Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
}
```

上面代码是使用以下依赖观察对象在 JVM 内存的数据

```xml
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.17</version>
    <scope>compile</scope>
</dependency>
```

## volatile

`volatile` 关键字提供一种轻量级的同步机制，主要用于确保变量的**可见性**和**防止指令重排序**。

```java
volatile boolean stop;

Runnable task = new Runnable() {
    @Override
    public void run() {
        while (!stop) {
            IO.println(Thread.currentThread() + " run...");
        }
    }
};

void main() throws Exception {
    var t = new Thread(task);
    t.start();

    TimeUnit.SECONDS.sleep(3L);

    stop = true;
    IO.println("main end");
}
```
