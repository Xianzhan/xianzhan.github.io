# JVM 参数

## 元空间

- `-XX:MaxMetaspaceSize=256m`: 元空间最大大小。

## 堆内存

- `-Xms`: JVM 最小堆内存。(`-Xms4g`)
- `-Xmx`: JVM 最大堆内存。(`-Xmx4g`)

通常 `-Xms` 和 `-Xmx` 一样，可避免运行时动态扩缩带来的性能抖动。

- `-XX:+HeapDumpOnOutOfMemoryError`: 开启 HeapDump，便于 OOM 问题排查。
- `-XX:HeapDumpPath=/var/log/app/`: HeapDump 文件存放路径。

## GC

- `-XX:+DisableExplicitGC`: 禁用显示 GC，防止第三方库或用户代码误调用 `System.gc()` 引发 Full GC。

### CMS

> @since 14 移除

- `-XX:+UseConcMarkSweepGC`: 使用 CMS 垃圾收集器，适合中等堆（1GB-4GB）。
- `-XX:+UseCMSInitiatingOccupancyOnly`: 使用 CMS 垃圾收集器时，只根据预留内存百分比触发 GC。
- `-XX:CMSInitiatingOccupancyFraction=75`: 预留内存百分比。

### G1

- `-XX:+UseG1GC`: 使用 G1 垃圾收集器，适合大堆（>=4GB）。
- `-XX:MaxGCPauseMillis=200`: 将 GC 暂停控制在 200ms 内。

### ZGC

- `-XX:+UseZGC`: 使用 ZGC 垃圾收集器，适合大堆（>=4GB）。

## 日志

- `-Xlog:gc*:file=/var/log/app/gc.log`: 开启 GC 日志。
