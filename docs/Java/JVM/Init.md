# JVM 初始化

执行 `java Hello` 后，通过调用 JNI(Java Native Interface) 函数 [`JNI_CreateJavaVM()`](https://github.com/openjdk/jdk/blob/jdk-25%2B36/src/hotspot/share/prims/jni.cpp#L3672) 来启动 JVM，为 Java 程序的运行创建一个真正的环境。

我们可以使用以下命令来查看 JVM 所做的事：

```sh
# powershell
> java -version
openjdk version "25"
> java -Xlog:all=trace Hello > ./Hello.txt
```

## 验证用户输入

JVM 启动过程中的第一步就是验证用户输入：JVM 参数、待执行的 artifact 以及 classpath。

```log
[0.006s][info][arguments] VM Arguments:
[0.006s][info][arguments] jvm_args: -XX:ThreadPriorityPolicy=1 -XX:+UnlockExperimentalVMOptions -XX:+EnableJVMCIProduct -XX:+EnableJVMCI -XX:-UnlockExperimentalVMOptions -Xlog:all=trace 
[0.006s][info][arguments] java_command: Hello
[0.006s][info][arguments] java_class_path (initial): .
[0.006s][info][arguments] Launcher Type: SUN_STANDARD
```

## 检测系统资源

JVM 检测可使用的处理器、系统内存和系统服务，这些系统资源会影响 JVM 内部启发式算法做出决策。例如，JVM 默认选择的垃圾收集器取决于 CPU 和内存，但这些启发式算法可以通过显示 JVM 参数覆盖。

```log
[0.006s][debug][os       ] Initial active processor count set to 16
[0.006s][trace][gc,heap  ]   Maximum heap size 4119193600
[0.006s][trace][gc,heap  ]   Initial heap size 257449600
[0.006s][trace][gc,heap  ]   Minimum heap size 6815736
[0.006s][info ][metaspace]  - commit_granule_bytes: 65536.
[0.006s][info ][metaspace]  - commit_granule_words: 8192.
[0.006s][info ][metaspace]  - virtual_space_node_default_size: 8388608.
[0.006s][info ][metaspace]  - enlarge_chunks_in_place: 1.
```

## 准备环境

在了解可用系统资源后，JVM 开始准备环境，JVM 会生成 `hsprefdata`（HotSpot performance data HotSpot 性能数据）。`JConsole` 和 `VisualVM` 等工具会使用这些数据来检查和分析 JVM。这些数据通常存储在 `/tmp` 目录中。以下只是 JVM 创建此分析数据的一个示例：

```log
[0.008s][debug][perf,memops] PerfDataMemorySize = 32768, os::vm_allocation_granularity = 65536, adjusted size = 65536
[0.010s][debug][perf,memops] PerfMemory created: address = 0x0000029a2f540000, size = 65536
...
[0.010s][debug][perf,datacreation] name = sun.rt.createVmBeginTime, dtype = 11, variability = 3, units = 1, dsize = 8, vlen = 0, pad_length = 3, size = 56, on_c_heap = FALSE, address = 0x0000029a2f540020, data address = 0x0000029a2f540050
...
[1.777s][info ][perf,class,link        ] At VM initialization completion:
[1.777s][info ][perf,class,link        ] ClassLoader:
[1.777s][info ][perf,class,link        ]   clinit:               953ms / 563 events
[1.777s][info ][perf,class,link        ]   link methods:         4ms / 12140 events
[1.777s][info ][perf,class,link        ]   method adapters:      3ms / 255 events
[1.777s][info ][perf,class,link        ]   resolve...
[1.777s][info ][perf,class,link        ]     invokedynamic:   86ms / 11 events
[1.777s][info ][perf,class,link        ]     invokehandle:    6ms / 6 events
[1.777s][info ][perf,class,link        ]     CP_MethodHandle: 21ms / 14 events
[1.777s][info ][perf,class,link        ]     CP_MethodType:   0ms / 18 events
[1.777s][info ][perf,class,link        ] 
...
```

## 选择垃圾收集器

每种 GC 都有其独特的性能特征和理想的工作环境，若无显示参数选择 GC，大多数情况下默认使用 G1 GC。

```log
[0.015s][debug][gc,remset        ] Card Set container configuration: InlinePtr #cards 4 size 8 Array Of Cards #cards 16 size 48 Howl #buckets 8 coarsen threshold 3686 Howl Bitmap #cards 512 size 80 coarsen threshold 460 Card regions per heap region 1 cards per card region 4096
[0.015s][info ][gc               ] Using G1
[0.015s][trace][gc,heap,coops    ] Trying to allocate at address 0x000000070a600000 heap of size 0xf5a00000
[0.015s][trace][os               ] VirtualAlloc(0x000000070a600000, 4120903680, 2000, 4) returned 0x000000070a600000.
[0.015s][debug][os,map           ] Reserved [0x000000070a600000 - 0x0000000800000000), (4120903680 bytes)
[0.015s][debug][gc,heap,coops    ] Heap address: 0x000000070a600000, size: 3930 MB, Compressed Oops mode: Zero based, Oop shift amount: 3
```

## 类数据共享（CDS）

查找 CDS 文件，可以提升 JVM 启动性能。但 CDS 即将淘汰，无需多关注。

```log
[0.029s][info ][cds              ] trying to map $USER_HOME\.jdks\graalvm-ce-25.0.0\bin\server\classes.jsa
[0.029s][info ][cds              ] Opened shared archive file $USER_HOME\.jdks\graalvm-ce-25.0.0\bin\server\classes.jsa.
```

## 创建元空间

JVM 最后初始化的步骤之一是创建元空间（JVM 8 之前叫方法区），这是一个特殊的堆外内存位置，JVM 加载类数据时，会将其存储在这里。虽然元空间不在 JVM 的堆中，但垃圾收集器仍然会对其进行管理。如果与元空间关联的类加载器不再处于作用域内，则存储在元空间的类数据可以被移除。

```log
[0.029s][debug][metaspace,map    ] Mapped at 0x000000000a000000
```

接下来就是进行类加载了。
