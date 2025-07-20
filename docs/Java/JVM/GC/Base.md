# GC 基础

## 内存结构

![Base_Menory_Management.excalidraw.svg](./Base_Menory_Management.excalidraw.svg)

**Stack**: 栈帧, 线程私有, 随着方法调用创建, 随着方法返回销毁.

**Heap**: 堆, 线程共享, 需要垃圾回收(GC)管理. 存储对象实例、数组等动态分配的数据.

**Metaspace**: 元空间, 使用本地内存(非堆内存), 线程共享. 存储 JVM 加载的 `Class` 元信息、常量、JIT 编译的代码缓存等数据. 该区域支持选择性回收(如常量池回收、类卸载等).

```java
public class Main {

    record Person(String name) {
        @Override
        public String toString() {
            return name;
        }
    }

    public static void f() {
        var a = new Person("f.A"); // 堆对象
        var b = new Person("f.B"); // 堆对象
        var c = new Person("f.C"); // 堆对象

        var list = List.of(a, b);  // 堆对象
    }

    public static void main(String[] args) {
        var a = 10;                   // 栈对象（基本类型）
        var b = new Person("main.B"); // 堆对象

        f();                          // 调用方法

        b = null;                     // 断开引用对象
    }
}
```

JVM 有一套自己的自动管理内存的机制, 称之为**垃圾回收器**, 每次执行 `new` 字节码时会申请内存, 并将该内存设置为占用. 现在我们从上面 `main()` 方法开始执行, 创建栈帧

![Base_Menory_Management_main.excalidraw.svg](./Base_Menory_Management_main.excalidraw.svg)

执行 `var a = 10;`

![Base_Menory_Management_main_a_10.excalidraw.svg](./Base_Menory_Management_main_a_10.excalidraw.svg)

执行 `var b = new Person("main.B");`

![Base_Menory_Management_main_b_p.excalidraw.svg](./Base_Menory_Management_main_b_p.excalidraw.svg)

执行 `f();`, 创建栈帧

![Base_Menory_Management_main_call_f.excalidraw.svg](./Base_Menory_Management_main_call_f.excalidraw.svg)

执行 `f()` 完毕但还未返回

![Base_Menory_Management_main_call_f_done_not_return.excalidraw.svg](./Base_Menory_Management_main_call_f_done_not_return.excalidraw.svg)

执行 `f()` 完毕后返回 `main()`

![Base_Menory_Management_main_call_f_done_return.excalidraw.svg](./Base_Menory_Management_main_call_f_done_return.excalidraw.svg)

此时我们可以发现, 堆上有些数据不可访问了, 并且占用着内存, 继续执行 `b = null;`

![Base_Menory_Management_main_b_null.excalidraw.svg](./Base_Menory_Management_main_b_null.excalidraw.svg)

代码逻辑全部执行完后, 堆上有很多无法访问的垃圾数据, 若该应用是个服务器应用或其他, 还需要执行其他方法, 堆始终会有用完的时候, 那么堆快满的时候, 垃圾收集器就要工作清理垃圾防止内存耗尽导致 `OutOfMemoryError`.

## 收集算法

### 引用计数法

对象维护计数器，引用增减时更新，计数为 `0` 则回收.

### 可达性分析算法

JVM 垃圾回收的核心机制, 用于判断对象是否存活. 其核心思想是通过一系列称为 ​​`GC Roots`​​ 的根对象作为起点, 向下搜索引用链, 若一个对象无法被任何 `GC Roots` 直接或间接引用, 则判定为垃圾对象.

## 回收阶段

清理内存时, 并非一步到位的事情. 分为以下三个阶段:
1. 追踪(Tracing): 识别所有可达对象
2. 释放(Freeing): 释放不再使用的内存
3. 压缩(Compaction): 移动 heap 对象, 并重新定位活动对象

## Stopping The World

简称 STW, 是指在执行垃圾回收的过程中, 冻结所有应用线程的执行, 直到垃圾回收线程执行结束.

过程：

![Base_STW.excalidraw.svg](./Base_STW.excalidraw.svg)

### SafePoint

安全点, 应用线程执行过程中的一些特殊位置. SafePoint 保存了应用线程的上下文.

## 收集器原理

### 标记-清除(非移动)

- 原理: 分两阶段
    1. 标记所有可达对象(从 GC Roots 遍历引用链)
    2. 清除未标记对象
- 优点: 实现简单, 无需移动对象
- 缺点: 产生内存碎片, 影响大对象分配, 两次全堆扫描效率低

### 标记-压缩(移动)

- 原理: 标记后, 将存活对象向一端移动, 清理边界外内存
- 优点: 无碎片, 内存利用率高
- 缺点: 对象移动开销大, 停顿时间较长

### 标记-复制(移动)

- 原理: 将内存分为两个对等大小块(From/To), 存活对象复制到空闲区(To), 清空原区(From)
- 优点: 无内存碎片, 分配高效
- 缺点: 浪费 50% 内存, 对象存活率高时复制开销大

### 分代收集

- 原理: 按对象生命周期划分堆为​​新生代​​（短命对象）和​​老年代​​（长命对象）
    - 新生代: 采用复制算法
    - 老年代: 采用标记-清除或标记-整理
- 优点: 针对不同代优化效率（如98%新生代对象可快速回收）
- 缺点: 对象晋升逻辑复杂, 需维护代间关系(卡表或记忆集)
