# 并发基础

## 进程 vs 线程

||进程|线程|
|---|---|---|
|内存|独立（堆、栈、数据段、代码段）|共享（堆、数据段、代码段）|
|通信|IPC（管道、消息队列、信号量、共享内存、套接字）|共享变量|
|创建和切换开销|大|小|
|隔离性|强（一个进程崩溃不会影响其他进程）|弱（一个线程崩溃可能会导致整个进程崩溃）|

进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位，是操作系统结构的基础。

```java
void main() throws Exception {
    var processBuilder = new ProcessBuilder("java", "-version");
    processBuilder.redirectErrorStream(true);  // 合并标准输出和错误输出
    
    var process = processBuilder.start();
    process.waitFor();
    IO.println(process.inputReader().readAllAsString());
}
// openjdk version "25" 2025-09-16 LTS
// OpenJDK Runtime Environment Temurin-25+36 (build 25+36-LTS)
// OpenJDK 64-Bit Server VM Temurin-25+36 (build 25+36-LTS, mixed mode, sharing)
```

线程（Thread）是操作系统能够进行运算调度的最小单位。它被包含在进程之中，是进程中的实际运作单位。一条线程指执行一个任务。

```java

void main() throws Exception {
    var thread = Thread.ofPlatform()
        .factory()
        .newThread(() -> IO.println("Hello " + Thread.currentThread().getName()));
    thread.start();
    thread.join();
}
// Hello Thread-0
```

## 并发 vs 并行

并发（Concurrency）是指在同一时间段内处理多个任务，但在同一时刻只能执行一个任务。例如单核 CPU 处理多任务，每个任务轮流执行，看起来像是同时执行的。

并行（Parallelism）是指在同一时刻真正同时执行多个任务。例如多核 CPU 处理多任务，每个核同时执行一个任务。

## 上下文切换

上下文切换是指 CPU 从一个线程切换到另一个线程的过程，包括保存当前线程状态、恢复目标线程状态、更新调度器等。

### 切换过程

1. 保存当前线程的上下文
    - 程序计数器 PC
    - 栈指针 SP
    - 寄存器状态
    - 栈信息
2. 调度器选择目标线程
3. 恢复目标线程的上下文
    - 恢复程序计数器 PC
    - 恢复栈指针 SP
    - 恢复寄存器状态
    - 恢复栈信息
4. 开始执行新线程

### 触发条件

- 时间片用完：线程执行时间达到分配的时间片
- 线程主动让出：调用 `Thread.yield()`、`Thread.sleep()`、`Object.wait()` 等
- I/O 操作：线程等待 I/O 操作完成
- 锁竞争：线程获取锁失败进入阻塞状态
- 更高优先级线程就绪：有更高优先级线程等待执行

### 切换开销

1. CPU 时间开销
    - 切换本身需要 CPU 指令执行（通常 1~10 微秒）
    - 频繁切换会降低 CPU 利用率（都在切换未执行业务逻辑）
2. 缓存失效
    - 每个 CPU 核心有 L1/L2 缓存，线程切换时可能失效，需要重新从内存加载
    - 缓存失效可能带来几十微秒的延迟
3. TLB(Translation Lookaside Buffer) 缓存虚拟地址到物理地址的映射失效
    - 切换可能需要刷新

### 切换优化

1. 合理设置时间片：避免频繁切换
2. 减少线程数量：根据 CPU 核心数合理设置线程或线程池
3. 使用无锁算法：CAS、原子类等减少线程阻塞
4. 减少 I/O 操作：多使用缓存

## 并发三要素

并发三要素是指**原子性**、**可见性**、**有序性**。它们是衡量代码是否并发安全的标准，如果代码不能同时满足这三点，在多线程环境下就会产生各种诡异的问题（如数据不一致、死锁、空指针异常等）。

### 原子性

原子性（Atomicity）指一个或多个操作不可分割，操作过程不会被任何因素打断。主要由于 CPU 分时复用引起。

### 可见性

可见性（Visibility）指一个线程修改了共享变量，其他线程能立即看到。主要由于 CPU 缓存（L1/L2）引起。

### 有序性

有序性（Ordering）指程序执行顺序符合预期，防止指令重排。主要由于编译器优化和指令级并行技术（Instruction-Level Parallelism, ILP）引起。

## 关键字

- `synchronized`: JVM 锁实现，可修饰方法或代码块，提供互斥访问
- `volatile`: 保证字段的可见性并禁止指令重排序，但不保证原子性（如 `obj.i++`）
- `final`: 保证初始化安全性，使对象在不可变状态发布

## Java 内存模型（JMM）

- 主内存与工作内存：所有变量存放在主内存，每个线程有自己的工作内存
- Happens-Before 规则：判断数据是否存在竞争、线程是否安全的主要依据

## JUC 核心工具

> @since 5 [JSR 166: Concurrency Utilities](https://jcp.org/en/jsr/detail?id=166)

锁相关

- `LockSupport`: 用来创建锁和其他同步类的基本线程阻塞原语
- `AbstractOwnableSynchronizer`: 可以由线程以独占方式拥有的同步器
- `AbstractQueuedSynchronizer`: 实现依赖于先进先出 (FIFO) 等待队列的阻塞锁和相关同步器(信号量、事件，等等)提供一个框架
- `ReentrantLock`: 比 `synchronized` 更灵活的可重入锁，支持公平锁、响应中断和超时
- `ReentrantReadWriteLock`: 读写锁接口 `ReadWriteLock` 的实现类，它包括 `Lock` 子类 `ReadLock` 和 `WriteLock`。`ReadLock` 是共享锁，`WriteLock` 是独占锁。

线程池

- `ThreadPoolExecutor`: 线程池实现类，在大量异步任务减少线程的创建
