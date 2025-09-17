# Lambda

## JEP

> @since 8 [JEP 109: Enhance Core Libraries with Lambda](https://openjdk.org/jeps/109)<br>
> @since 8 [JEP 126: Lambda Expressions & Virtual Extension Methods](https://openjdk.org/jeps/126)<br>
> @since 8 [JEP 160: Lambda-Form Representation for Method Handles](https://openjdk.org/jeps/160)<br>
> @since 8 [JEP 210: LambdaForm Reduction and Caching](https://openjdk.org/jeps/210)<br>
> @since 11 [JEP 323: Local-Variable Syntax for Lambda Parameters](https://openjdk.org/jeps/323)<br>

## 方法引用

```java
public class Lambda {
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