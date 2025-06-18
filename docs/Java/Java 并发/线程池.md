# 线程池

## ThreadPoolExecutor

- `corePoolSize` 计算方式:
    1. **CPU 密集**: $CPU 核数 + 1$
    2. **IO 密集**: $CPU 核数 \times 2$
    3. **动态调整**: $(任务数 \times 单任务耗时) \over 目标响应时间$

- `maximumPoolSize` 计算方式:
    1. 常规场景: 与 `corePoolSize` 保持一致, 减少线程频繁创建销毁的开销.
    2. 突发流量: 设为 `corePoolSize` 的 2~4 倍, 应对任务队列饱和后的突发任务. 需注意的是, 过大会导致内存溢出或上下文切换过多.

- `keepAliveTime` 和 `timeUnit` 非核心线程未有任务该时间后销毁.

- `blockingQueue` 阻塞队列的选择:
    - `SynchronousQueue`: 适用低延迟任务, 任务不排队直接移交线程.
    - `ArrayBlockingQueue`: 适用需严格控制资源消耗的场景, $容量 = {corePoolSize \over taskCost} \times responseTime$
    - `LinkedBlockingQueue`: 分有界和无界场景, 有界可参考 `ArrayBlockingQueue`, 无界需注意 OOM.

```java
int corePoolSize = Runtime.getRuntime().availableProcessors();
int maximumPoolSize = corePoolSize * 2;
long keepAliveTime = 60L;
TimeUnit timeUnit = TimeUnit.SECONDS;
BlockingQueue<Runnable> blockingQueue = new ArrayBlockingQueue<>(100);
try (var tpe = new ThreadPoolExecutor(
        corePoolSize,
        maximumPoolSize,
        keepAliveTime,
        timeUnit,
        blockingQueue,
        Executors.defaultThreadFactory(),
        new ThreadPoolExecutor.CallerRunsPolicy()
)) {
    tpe.execute(() -> {
        System.out.println("Hello world");
        try {
            timeUnit.sleep(10L);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        System.out.println("Bye");
    });
}
```