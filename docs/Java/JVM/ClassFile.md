# class 文件

```c
ClassFile {
    u4             magic;
    u2             minor_version;
    u2             major_version;
    u2             constant_pool_count;
    cp_info        constant_pool[constant_pool_count-1];
    u2             access_flags;
    u2             this_class;
    u2             super_class;
    u2             interfaces_count;
    u2             interfaces[interfaces_count];
    u2             fields_count;
    field_info     fields[fields_count];
    u2             methods_count;
    method_info    methods[methods_count];
    u2             attributes_count;
    attribute_info attributes[attributes_count];
}
```

Main.java

```java
// JDK 25
void main() {
    IO.println("Hello, World!");
}
```

```sh
javac Main.java | javap -v Main
```

## 魔数

`magic` 是 `class` 文件标识，固定 `0xCAFEBABE`。

## 版本号

`minor_version` 次要版本值范围在 0~65536。

`major_version` 主要版本值为：

- JDK 25: 69
- JDK 21: 65
- JDK 17: 61
- JDK 11: 55
- JDK 8: 52

```java
final class Main
  minor version: 0
  major version: 69
```

## 常量池

`constant_pool` 存放**字面量**和**符号引用**

```java
Constant pool:
   #1 = Methodref          #2.#3          // java/lang/Object."<init>":()V
   #2 = Class              #4             // java/lang/Object
   #3 = NameAndType        #5:#6          // "<init>":()V
   #4 = Utf8               java/lang/Object
   #5 = Utf8               <init>
   #6 = Utf8               ()V
   #7 = String             #8             // Hello, World!
   #8 = Utf8               Hello, World!
   #9 = Methodref          #10.#11        // java/lang/IO.println:(Ljava/lang/Object;)V
  #10 = Class              #12            // java/lang/IO
  #11 = NameAndType        #13:#14        // println:(Ljava/lang/Object;)V
  #12 = Utf8               java/lang/IO
  #13 = Utf8               println
  #14 = Utf8               (Ljava/lang/Object;)V
  #15 = Class              #16            // Main
  #16 = Utf8               Main
  #17 = Utf8               Code
  #18 = Utf8               LineNumberTable
  #19 = Utf8               main
  #20 = Utf8               SourceFile
  #21 = Utf8               Main.java
```

## 访问标志

`access_flags` 标识类或接口的访问权限，例如是否为 `public`/`final`/`abstract` 等

```java
  flags: (0x0030) ACC_FINAL, ACC_SUPER
```

## 当前类名

`this_class` 为 `constant_pool` 的索引

```java
  this_class: #15                         // Main
```

## 父类名

`super_class` 为 `constant_pool` 的索引

```java
  super_class: #2                         // java/lang/Object
```

## 接口信息

`interfaces` 列出所有实现接口在常量池的索引。

## 字段信息

`fields` 列出所有字段信息。

## 方法信息

`methods` 列出所有方法信息。

## 属性信息

`attributes` 列出所有属性信息。