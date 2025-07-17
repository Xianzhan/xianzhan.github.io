# GC 基础

## 内存结构

![Base_Menory_Management.excalidraw.svg](./Base_Menory_Management.excalidraw.svg)

**Stack**: 栈帧, 线程私有, 随着方法调用创建, 随着方法返回销毁.

**Heap**: 堆, 线程共享, 需要垃圾回收.

**Metaspace**: 元空间, 使用本地内存, 线程共享. 存储 JVM 加载的 `Class` 信息、常量、JIT 编译的代码缓存等数据. 该区域可以选择垃圾回收, 主要是常量池以及 `Class` 的卸载.