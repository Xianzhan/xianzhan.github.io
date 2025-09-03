# 线程

## Thread

### Runnable

```java
Runnable runner = () -> {
    for (; ; ) {
        System.out.println(System.currentTimeMillis());
    }
};
// 创建新线程执行任务
new Thread(runner).start();
```

### Callable

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