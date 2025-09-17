# 类加载器

## 概述

JVM 启动的时候，不会一次性加载所有的 `.class` 文件，而是根据需要去动态加载。加载 `.class` 文件的则是 `ClassLoader`。

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

## 自定义

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