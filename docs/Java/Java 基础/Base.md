# Java 基础

## 环境

`java -version`
```sh
openjdk version "24" 2025-03-18
OpenJDK Runtime Environment GraalVM CE 24+36.1 (build 24+36-jvmci-b01)
OpenJDK 64-Bit Server VM GraalVM CE 24+36.1 (build 24+36-jvmci-b01, mixed mode, sharing)
```

## Hello world

Hello.java
```java
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}
```

```sh
java Hello.java
# Hello world
```