# 类加载器

JVM 启动的时候，不会一次性加载所有的 `.class` 文件，而是根据需要去动态加载。加载 `.class` 文件的则是 `ClassLoader`。

`ClassLoader` 的核心方法有：

- `ClassLoader#loadClass`: 加载类的入口，实现**双亲委派模型**
- `ClassLoader#findClass`: 定义查找并读取字节码数据
- `ClassLoader#defineClass`: 将字节数组转换为 `Class` 对象，不可重写
- `ClassLoader#resolveClass`: 链接已加载的类，不可重写

## 双亲委派模型

双亲委派模型是 Java 类加载机制的核心设计，它通过一套良好的规则来确保类的**安全**加载和**唯一性**。

- 安全性：防止核心 API 被篡改。例如，用户自定义一个 `java.lang.String` 类，该请求最终委派给 Bootstrap 加载器，由它加载 JVM 内部的 `java.lang.String` 类，从而确保核心库的安全。
- 唯一性：同一个类不会被不同的类加载器重复加载。这避免了在 JVM 中出现多个全限定名相同但由不同加载器加载的类，防止类型转换混乱（如：`ClassCastException`）。

## 系统内置类加载器

JDK 自带以下类加载器：

- `Bootstrap ClassLoader`
- `Ext ClassLoader`
- `App ClassLoader`

### Bootstrap ClassLoader

引导类加载器是最顶层的加载器，是 JVM（即 C/C++ 实现）的一部分，它不是一个 Java 类，所以无法在 Java 代码中获取它的引用。主要加载核心类库，如 `java.lang.String`。

```java
ClassLoader bootstrapClassLoader = String.class.getClassLoader();
// bootstrapClassLoader: null

// JDK 8 扫描路径 bootClassPath
String bootClassPath = System.getProperty("sun.boot.class.path");
// bootClassPath: JDK8_HOME\jre\lib\resources.jar;
//                JDK8_HOME\jre\lib\rt.jar;
//                JDK8_HOME\jre\lib\sunrsasign.jar;
//                JDK8_HOME\jre\lib\jsse.jar;
//                JDK8_HOME\jre\lib\jce.jar;
//                JDK8_HOME\jre\lib\charsets.jar;
//                JDK8_HOME\jre\lib\jfr.jar;
//                JDK8_HOME\jre\classes
```

> 注：由 Bootstrap ClassLoader 类加载器所加载的类的 `ClassLoader` 都是 `null`。即若一个类的 `Class#getClassLoader` 方法返回 `null`，那么它就是由 Bootstrap ClassLoader 类加载器加载的。

### Ext ClassLoader

扩展类加载器，加载目录 `JDK8_HOME/jre/lib/ext` 下的 jar 包和 class 文件。

```java
// DNSNameService 是 JDK8_HOME/jre/lib/ext/dnsns.jar 里的一个类
ClassLoader extClassLoader = sun.net.spi.nameservice.dns.DNSNameService.class.getClassLoader();
// extClassLoader: sun.misc.Launcher$ExtClassLoader@7d4991ad

// JDK 8 扫描路径 extClassPath
String extClassPath = System.getProperty("java.ext.dirs");
// extClassPath: JDK8_HOME\jre\lib\ext;
//               C:\Windows\Sun\Java\lib\ext
```

### App ClassLoader

应用类加载器，加载的就是开发所写的 `.class` 文件，路径就是 `CLASSPATH` 指向的目录。

```java
ClassLoader appClassLoader = Main.class.getClassLoader();
// appClassLoader: sun.misc.Launcher$AppClassLoader@18b4aac2

// JDK 8 扫描路径 appClassPath
String appClassPath = System.getProperty("java.class.path");
// appClassPath: java -classpath/-cp 的目录
```

## 自定义类加载器

```java
import java.nio.file.Files;
import java.nio.file.Path;

public class LocalDiskClassLoader extends ClassLoader {

    private final Path path;

    public LocalDiskClassLoader(Path path) {
        this.path = path;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        if (name == null) {
            return null;
        }

        var namePath = name.replace('.', '/') + ".class";
        try {
            var bytes = Files.readAllBytes(path.resolve(namePath));
            return defineClass(name, bytes, 0, bytes.length);
        } catch (Exception _) {

        }
        return null;
    }
}
```