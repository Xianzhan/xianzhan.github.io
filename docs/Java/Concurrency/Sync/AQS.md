# AQS

## AbstractQueuedSynchronizer

AQS 是 `AbstractQueuedSynchronizer` 的缩写，翻译过来就是抽象队列同步器。

AQS 是 Java 并发包 `java.util.concurrent` 的基石，提供了一个框架，用于实现阻塞锁和相关的同步器（信号量、事件等），这些同步器依赖于先进先出 (FIFO) 等待队列。此类旨在为大多数**依赖单个原子整数值来表示状态的同步器提供有用的基础**。子类必须定义用于更改此状态的受保护方法，以及定义该状态在对象被获取或释放时的含义。有了这些定义，此类中的其他方法将执行所有排队和阻塞机制。子类可以维护其他状态字段，但只有使用 `getState`、`setState` 和 `compareAndSetState` 方法操作的原子更新的整数值才会被跟踪以进行同步。

子类应定义为非公开的内部辅助类，用于实现其父类的同步属性。类 `AbstractQueuedSynchronizer` 并未实现任何同步接口。相反，它定义了诸如 `acquireInterruptibly` 之类的方法，这些方法可由具体的锁和相关的同步器根据需要调用，以实现它们的公共方法。

此类支持默认的**独占模式**/**共享模式**。在独占模式下获取锁时，其他线程的获取尝试将无法成功。多个线程在共享模式下的获取尝试可能（但不一定）成功。此类并不 "理解" 这些模式之间的区别，只是在机制层面上，当共享模式获取成功时，下一个等待的线程（如果存在）也必须判断自己是否可以获取锁。处于不同模式的等待线程共享同一个 FIFO 队列。通常，实现子类只支持其中一种模式，但两种模式都可以同时使用，例如在 `ReadWriteLock` 中仅支持独占模式或仅支持共享模式的子类无需定义支持未使用模式的方法。

核心字段：

```java
public abstract class AbstractQueuedSynchronizer
    extends AbstractOwnableSynchronizer
    implements java.io.Serializable {

    private transient volatile Node head;
    private transient volatile Node tail;
    private volatile int state;

    /**
     * 记录当前以独占模式持有同步器（即锁）的线程，继承 AbstractOwnableSynchronizer
     */
    private transient Thread exclusiveOwnerThread;
}
```

- `head`: 头节点
  1. 标识当前持有资源的线程，`head.waiter == null`
  2. 作为 CLH 同步队列的管理入口
  3. 触发后继节点的获取与唤醒

- `tail`: 尾节点
  1. 标识当前没有资源的线程，`tail.waiter != null`。
    - 注意：若是第一次，则与 head 一同初始化且指向一个不包含线程的虚拟节点，`head == tail`
  2. 管理新节点 CAS 入队
  3. 支持从后向前遍历

- `state`: 资源状态，不同场景具有不同的含义
  - `ReentrantLock`: 锁的持有计数。0 表示锁未被任何线程占用；>=1 表示锁被占用，其数值代表持有线程的重入次数。
  - `ReentrantReadWriteLock`: 高16位表示读锁持有数，低16位表示写锁持有数。通过一个变量同时管理读、写两种状态。
  - `Semaphore`: 当前可用的许可证数量。线程获取许可证时 `state` 减少，释放时增加。
  - `CountDownLatch`: 计数器的当前值。初始化后，每次有线程调用 `countDown()`，`state` 减 1，直至为 0 时唤醒所有等待线程。
