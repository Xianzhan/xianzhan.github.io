# Module

> 使开发人员更容易地构建和维护库和大型应用程序;
>
> 提高 Java SE 平台实现的安全性和可维护性，特别是 JDK;
>
> 提高应用程序性能;
>
> 使 Java SE 平台和 JDK 能够缩小规模，以便在小型计算设备和密集的云部署中使用。
>

## JEP

> @since 8 [JEP 162: Prepare for Modularization](http://openjdk.java.net/jeps/162)
>
> @since 9 [JEP 200: The Modular JDK](http://openjdk.java.net/jeps/200)
>
> @since 9 [JEP 201: Modular Source Code](http://openjdk.java.net/jeps/201)
>
> @since 9 [JEP 220: Modular Run-Time Images](http://openjdk.java.net/jeps/220)
>

## module-info.java

```java
// module-info.java
module my.module.name {

    // 可以添加 requires 子句，声明模块在编译时和运行时(按名称)依赖于其他模块
    requires java.desktop;

    // 其他依赖 my.module.name 模块的模块, 也可以访问 java.logging 模块
    requires public java.logging;

    // 可以添加 exports 子句来声明模块使特定包中的所有且仅为公共类型可供其他模块使用
    exports my.module;
    // 只暴露给 other.module 模块
    exports my.module to other.module

    // 运行时通过反射访问
    opens my.module;

    // SPI
    uses service.module.Provider;
    provides service.module.Provider with service.module.ProviderImpl;
}
```

