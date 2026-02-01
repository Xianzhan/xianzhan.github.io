# 定时任务

## Timer

```java
TimerTask task = new TimerTask() {
    @Override
    public void run() {
        System.out.println("Task executed: " + new Date());
    }
};
Timer timer = new Timer();
timer.schedule(task, 1000, 3000); // 延迟1秒，每3秒执行
```

## ScheduledExecutorService

```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(
    Runtime.getRuntime().availableProcessors()
);
executor.scheduleAtFixedRate(() -> System.out.println("Task: " + new Date()),
        0,
        3,
        TimeUnit.SECONDS
); // 立即开始，每3秒执行
```