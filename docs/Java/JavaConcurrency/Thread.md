# 线程

## 示例

Runnable

```java
Runnable runner = () -> {
    for (; ; ) {
        System.out.println(System.currentTimeMillis());
    }
};
// 创建新线程执行任务
new Thread(runner).start();
```

Callable

```java
Callable<Integer> caller = () -> {
    System.out.println("进入 caller");
    TimeUnit.SECONDS.sleep(3L);
    System.out.println("sleep 结束");
    return 42;
};
FutureTask<Integer> futureTask = new FutureTask<>(caller);
// 创建新线程执行任务
new Thread(futureTask).start();
System.out.println("futureTask#get: " + futureTask.get());

// 进入 caller
// sleep 结束
// futureTask#get: 42
```

## 生命周期

线程的生命周期（`Thread.State`）包括以下几个状态：

1. **新建（NEW）**：线程被创建但尚未启动。
2. **可运行（RUNNABLE）**：线程正在 JVM 中执行，但它可能在等待操作系统的资源（如处理器）。
3. **阻塞（BLOCKED）**：线程在等待获取一个排它锁（Monitor Lock），通常发生在进入 `synchronized` 代码块时。
4. **等待（WAITING）**：线程无限期地等待另一个线程执行特定操作（如 `Object.wait()`、`Thread.join()`）。
5. **超时等待（TIMED_WAITING）**：线程在指定的时间内等待另一个线程的操作（如 `Thread.sleep()`、`Object.wait()`）。
6. **终止（TERMINATED）**：线程已执行完毕或因异常退出了 `run()` 方法。

线程状态转换图：

```
     (NEW) ---> (RUNNABLE)
(RUNNABLE) <--> (BLOCKED)
(RUNNABLE) <--> (WAITING)
(RUNNABLE) <--> (TIMED_WAITING)
(RUNNABLE) ---> (TERMINATED)
```

## 阻塞（BLOCKED）

线程试图进入一个被其它线程持有的 `synchronized` 同步块或方法。

```java
synchronized void run() {
    while (true) ;
}

void main() throws InterruptedException {
    var unblockThread = new Thread(this::run);
    unblockThread.setName("unblockThread");
    unblockThread.start();

    TimeUnit.SECONDS.sleep(1L);

    var blockedThread = new Thread(this::run);
    blockedThread.setName("blockedThread");
    blockedThread.start();

    unblockThread.join();
    blockedThread.join();
}
```

执行上面代码并 `jstack pid`

```log
"unblockThread" #36 [5640] prio=5 os_prio=0 cpu=16000.00ms elapsed=16.05s tid=0x0000024a25988920 nid=5640 runnable  [0x00000056663ff000]
   java.lang.Thread.State: RUNNABLE
        at Main.run(Main.java:2)
        - locked <0x0000000719742050> (a Main)
        at Main$$Lambda/0x000000000b042a10.run(Unknown Source)
        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
        at java.lang.Thread.run(java.base@25/Thread.java:1474)

"blockedThread" #37 [19328] prio=5 os_prio=0 cpu=0.00ms elapsed=15.05s tid=0x0000024a254490b0 nid=19328 waiting for monitor entry  [0x0000005665aff000]
   java.lang.Thread.State: BLOCKED (on object monitor)
        at Main.run(Main.java:2)
        - waiting to lock <0x0000000719742050> (a Main)
        at Main$$Lambda/0x000000000b042c40.run(Unknown Source)
        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
        at java.lang.Thread.run(java.base@25/Thread.java:1474)
```

## 等待（WAITING）

线程无限期地等待另一个线程执行特定操作，如：

- `Object#wait`
- `Thred#join`
- `LockSupport#park`

```java
void main() throws Exception {
    var locker = new Object();
    var waitThread = new Thread(() -> {
        synchronized (locker) {
            try {
                locker.wait();
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
        }
    });
    waitThread.setName("waitThread");
    waitThread.start();

    var mainThread = Thread.currentThread();
    var joinThread = new Thread(() -> {
        try {
            mainThread.join();
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    });
    joinThread.setName("joinThread");
    joinThread.start();

    var parkThread = new Thread(LockSupport::park);
    parkThread.setName("parkThread");
    parkThread.start();

    waitThread.join();
    joinThread.join();
    parkThread.join();
}
```

`jstack pid`

```log
"waitThread" #36 [15724] prio=5 os_prio=0 cpu=0.00ms elapsed=14.64s tid=0x000001b6fcada240 nid=15724 in Object.wait()  [0x00000027018ff000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait0(java.base@25/Native Method)
        - waiting on <0x0000000719660d20> (a java.lang.Object)
        at java.lang.Object.wait(java.base@25/Object.java:389)
        at java.lang.Object.wait(java.base@25/Object.java:351)
        at Main.lambda$main$0(Main.java:6)
        - locked <0x0000000719660d20> (a java.lang.Object)
        at Main$$Lambda/0x0000000032042a10.run(Unknown Source)
        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
        at java.lang.Thread.run(java.base@25/Thread.java:1474)

"joinThread" #37 [13044] prio=5 os_prio=0 cpu=0.00ms elapsed=14.64s tid=0x000001b6fcabcd80 nid=13044 in Object.wait()  [0x00000027019ff000]
   java.lang.Thread.State: WAITING (on object monitor)
        at java.lang.Object.wait0(java.base@25/Native Method)
        - waiting on <0x0000000719a01eb8> (a java.lang.Thread)
        at java.lang.Object.wait(java.base@25/Object.java:389)
        at java.lang.Thread.join(java.base@25/Thread.java:1887)
        - locked <0x0000000719a01eb8> (a java.lang.Thread)
        at java.lang.Thread.join(java.base@25/Thread.java:1963)
        at Main.lambda$main$1(Main.java:18)
        at Main$$Lambda/0x0000000032042c40.run(Unknown Source)
        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
        at java.lang.Thread.run(java.base@25/Thread.java:1474)

"parkThread" #38 [17328] prio=5 os_prio=0 cpu=0.00ms elapsed=14.64s tid=0x000001b6fcb34070 nid=17328 waiting on condition  [0x0000002701aff000]
   java.lang.Thread.State: WAITING (parking)
        at jdk.internal.misc.Unsafe.park(java.base@25/Native Method)
        at java.util.concurrent.locks.LockSupport.park(java.base@25/LockSupport.java:369)
        at Main$$Lambda/0x0000000032043c00.run(Unknown Source)
        at java.lang.Thread.runWith(java.base@25/Thread.java:1487)
        at java.lang.Thread.run(java.base@25/Thread.java:1474)
```
