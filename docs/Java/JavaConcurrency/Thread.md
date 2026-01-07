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
