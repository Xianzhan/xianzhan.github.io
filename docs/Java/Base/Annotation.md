# 注解

## 元注解

用于定义其他注解行为的特殊注解，主要控制注解的作用范围、生命周期、文档化和继承性。

### `@Target`

指定注解可应用的目标元素类型（即注解能标注在哪些代码元素上）

```java
// 声明 @MyAnnotation 注解可作用于方法和字段
@Target({ElementType.METHOD, ElementType.FIELD})
public @interface MyAnnotation {}
```

- `ElementType#Type`: 类、接口（包括注释接口）、枚举或记录声明
- `ElementType#FIELD`: 字段声明（包括枚举常量）
- `ElementType#METHOD`: 方法声明
- `ElementType#PARAMETER`: 形式参数声明
- `ElementType#CONSTRUCTOR`: 构造函数声明
- `ElementType#LOCAL_VARIABLE`: 局部变量说明
- `ElementType#ANNOTATION_TYPE`: 注释接口声明（以前称为注释类型）。
- `ElementType#PACKAGE`: 包说明
- `ElementType#TYPE_PARAMETER`: @since 1.8 类型参数声明
- `ElementType#TYPE_USE`: @since 1.8 类型的使用
- `ElementType#MODULE`: @since 9 模块声明
- `ElementType#RECORD_COMPONENT`: @since 16 记录组件

### `@Retention`

定义注解的生命周期（即注解信息保留到哪个阶段）

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface RuntimeAnnotation {}
```

- `RetentionPolicy#SOURCE`: 注释将被编译器丢弃。如 `@Override`
- `RetentionPolicy#CLASS`: 注释将由编译器记录在类文件中，但不需要在运行时由VM保留。这是默认行为。
- `RetentionPolicy#RUNTIME`: 注释将由编译器记录在类文件中，并在运行时由VM保留，因此它们可能被反射地读取。

### `@Inherited`

允许子类继承父类上的注解（仅对类级注解有效）

限制：
- 不适用于方法、字段或接口上的注解。
- 需配合`@Retention(RUNTIME)`使用，反射才能读取继承的注解。

```java
@Inherited
@Retention(RetentionPolicy.RUNTIME)
public @interface InheritableAnnotation {}

@InheritableAnnotation
class Parent {}
class Child extends Parent {} // Child 自动继承 @InheritableAnnotation
```

### `@Repeatable`

@since 8 允许同一注解在同一元素上重复使用

```java
// 重复注解
@Repeatable(MyAnnotations.class)
public @interface MyAnnotation {
    String value();
}

// 容器注解
public @interface MyAnnotations {
    MyAnnotation[] value();
}

// 使用
@MyAnnotation("First")
@MyAnnotation("Second")
class MyClass {}
```

## 自定义注解与使用

```java
@Retention(RetentionPolicy.RUNTIME) // 注解在运行时保留
@Target(ElementType.METHOD)         // 仅用于方法
@interface Anno {
    String name() default "";
}

class X {
    @Anno(name = "x.method")
    void method() {
    }
}

public static void main(String[] args) throws Exception {
    Method method = X.class.getDeclaredMethod("method");
    if (method.isAnnotationPresent(Anno.class)) {
        Anno an = method.getAnnotation(Anno.class);
        System.out.println(an.name());
    }
}
```
