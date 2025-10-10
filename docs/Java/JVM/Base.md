# JVM 基础

## 规范

- [Java Language and Virtual Machine Specifications](https://docs.oracle.com/javase/specs/index.html)

## 内存

总内存 ≈ 堆内存 + 直接内存 + 元空间 + 线程栈 + JIT 代码缓存 + GC 开销 + JVM 自身内存<br>

- 堆内存 Heap

存放所有对象实例和数组。

- 直接内存

对外内存，通过 NIO 的 `ByteBuffer#allocateDirect` 方法分配。

控制参数：`-XX:MaxDirectMemorySize`

- 元空间

存放类的元数据，如类名、字节码等。

控制参数：`-XX:MaxMetaspaceSize`

- 线程栈

存放局部变量、方法调用信息等。

控制参数：`-Xss`

- JIT 代码缓存

存放热点代码，将字节码编译成本地机器码。

控制参数：`-XX:ReservedCodeCacheSize`

- GC 开销

垃圾收集器维护的数据结构。如 G1 的 Card Table、Remembered Set 等。

- JVM 自身内存

JVM 内部维护的数据结构，加载的 so/dll 库等。

## 架构

![Base_JVM_Architecture.excalidraw.svg](./Base_JVM_Architecture.excalidraw.svg)
