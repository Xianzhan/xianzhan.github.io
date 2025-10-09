# Lambda

## JEP

> @since 8 [JEP 109: Enhance Core Libraries with Lambda](https://openjdk.org/jeps/109)<br>
> @since 8 [JEP 126: Lambda Expressions & Virtual Extension Methods](https://openjdk.org/jeps/126)<br>
> @since 8 [JEP 160: Lambda-Form Representation for Method Handles](https://openjdk.org/jeps/160)<br>
> @since 8 [JEP 210: LambdaForm Reduction and Caching](https://openjdk.org/jeps/210)<br>
> @since 11 [JEP 323: Local-Variable Syntax for Lambda Parameters](https://openjdk.org/jeps/323)<br>

## 方法引用

Main.java

```java
static class Lambda {
    public static void staticMethod() {
    }
    public void instanceMethod() {
    }
}

void main() {
    Runnable staticMethodRef = Lambda::staticMethod;
    staticMethodRef.run();

    var lambda = new Lambda();
    Runnable instanceMethodRef = lambda::instanceMethod;
    instanceMethodRef.run();
}
```

> 如何获取 `staticMethodRef` 实际代表的是哪个类的方法？<br>
> 利用 Java 的 `java.io.Serializable` 接口。

```java
interface SerializableRunnable extends Runnable, Serializable {
}

void main() throws Exception {
    SerializableRunnable staticMethodRef = Lambda::staticMethod;
    staticMethodRef.run();

    Class<? extends SerializableRunnable> srClass = staticMethodRef.getClass();
    Method writeReplace = srClass.getDeclaredMethod("writeReplace");
    writeReplace.setAccessible(true);
    SerializedLambda sl = (SerializedLambda) writeReplace.invoke(staticMethodRef);
    // sl: SerializedLambda[capturingClass=class Main, functionalInterfaceMethod=Main$SerializableRunnable.run:()V, implementation=invokeStatic Main$Lambda.staticMethod:()V, instantiatedMethodType=()V, numCaptured=0]
    // 获取类名
    // sl#getImplClass: Main$Lambda
    // 获取方法名
    // sl#getImplMethodName: staticMethod
    // 获取方法签名
    // sl#getInstantiatedMethodType: ()V
}
```
