# Java 基础

## 环境

`java -version`
```sh
openjdk version "25" 2025-09-16
OpenJDK Runtime Environment GraalVM CE 25+37.1 (build 25+37-jvmci-b01)
OpenJDK 64-Bit Server VM GraalVM CE 25+37.1 (build 25+37-jvmci-b01, mixed mode, sharing)
```

## main

> @since 21 [JEP 445: Unnamed Classes and Instance Main Methods (Preview)](https://openjdk.org/jeps/445)<br>
> @since 22 [JEP 463: Implicitly Declared Classes and Instance Main Methods (Second Preview)](https://openjdk.org/jeps/463)<br>
> @since 23 [JEP 477: Implicitly Declared Classes and Instance Main Methods (Third Preview)](https://openjdk.org/jeps/477)<br>
> @since 24 [JEP 495: Simple Source Files and Instance Main Methods (Fourth Preview)](https://openjdk.org/jeps/495)<br>
> @since 25 [JEP 512: Compact Source Files and Instance Main Methods](https://openjdk.org/jeps/512)<br>

Hello.java

```java
// 实例 main()
void main() {
    IO.println("Hello void main()");
}
```

> 如何查找实例的 `main()` 方法?<br>
>
> `java Hello` JVM 加载主类 [src/java.base/share/native/libjli/java.c#L592](https://github.com/openjdk/jdk/blob/jdk-25%2B36/src/java.base/share/native/libjli/java.c#L592)

```c
// java.c#JavaMain(void* _args)
mainClass = LoadMainClass(env, mode, what);
```

> 调用 [`sun.launcher.LauncherHelper#checkAndLoadMain`](https://github.com/openjdk/jdk/blob/jdk-25%2B36/src/java.base/share/classes/sun/launcher/LauncherHelper.java#L734-L767) 方法确认主类是否静态和是否有参数

```c
// java.c#LoadMainClass(JNIEnv *env, int mode, char *name)
jclass cls = GetLauncherHelperClass(env);
NULL_CHECK0(mid = (*env)->GetStaticMethodID(env, cls,
            "checkAndLoadMain",
            "(ZILjava/lang/String;)Ljava/lang/Class;"));
NULL_CHECK0(result = (*env)->CallStaticObjectMethod(env, cls, mid,
                                                    USE_STDERR, mode, str));
```

```java
public final class LauncherHelper {
    private static boolean isStaticMain = false;
    private static boolean noArgMain = false;

    public static Class<?> checkAndLoadMain(boolean printToStder
                                        int mode,
                                        String what) {
        // ...
        validateMainMethod(mainClass);
        return mainClass;
    }

    private static void validateMainMethod(Class<?> mainClass) {
        Method mainMethod = null;
        try {
            mainMethod = MethodFinder.findMainMethod(mainClass);
        }
        // ...

        int mods = mainMethod.getModifiers();
        // 是否静态 main 方法
        isStaticMain = Modifier.isStatic(mods);
        // 是否无参数
        noArgMain = mainMethod.getParameterCount() == 0;
    }
}
```

> 最后根据 `LauncherHelper#isStaticMain` 和 `LauncherHelper#noArgMain` [判断](https://github.com/openjdk/jdk/blob/jdk-25%2B36/src/java.base/share/native/libjli/java.c#L627-L648)调用

```c
// java.c#JavaMain(void* _args)
helperClass = GetLauncherHelperClass(env);
isStaticMainField = (*env)->GetStaticFieldID(env, helperClass, "isStaticMain", "Z");
CHECK_EXCEPTION_NULL_LEAVE(isStaticMainField);
isStaticMain = (*env)->GetStaticBooleanField(env, helperClass, isStaticMainField);
noArgMainField = (*env)->GetStaticFieldID(env, helperClass, "noArgMain", "Z");
CHECK_EXCEPTION_NULL_LEAVE(noArgMainField);
noArgMain = (*env)->GetStaticBooleanField(env, helperClass, noArgMainField);

if (isStaticMain) {
    if (noArgMain) {
        ret = invokeStaticMainWithoutArgs(env, mainClass);
    } else {
        ret = invokeStaticMainWithArgs(env, mainClass, mainArgs);
    }
} else {
    if (noArgMain) {
        ret = invokeInstanceMainWithoutArgs(env, mainClass);
    } else {
        ret = invokeInstanceMainWithArgs(env, mainClass, mainArgs);
    }
}
```

Hello.java

```java
// 类 main(String[])
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

## 关键字

**修饰符**
- `public`
- `protected`
- `private`
- `abstract`
- `static`
- `final`
- `transient`
- `volatile`
- `synchronized`
- `native`

**声明**
- `boolean`
- `byte`
- `char`
- `short`
- `int`
- `long`
- `float`
- `double`
- `class`
- `interface`
- `extends`
- `package`
- `throws`
- `implements`
- `enum`: @since 5
- `record`: @since 14
- `sealed`: @since 15
- `permits`: @since 15
- `non-sealed`: @since 15

**控制流**
- `if`
- `else`
- `try`
- `catch`
- `finally`
- `do`
- `while`
- `for`
- `continue`
- `switch`
- `case`
- `default`
- `yield`: @since 14
- `break`
- `throw`
- `return`

**其他**
- `this`
- `new`
- `super`
- `import`
- `instanceof`
- `void`
- `strictfp`
- `assert`
- `goto`
- `const`
- `_`: @since 9
- `var`: @since 10

**字面量**
- `true`
- `false`
- `null`

## 原始类型

|类型|默认值|包装类|虚拟机内部符号|位数|
|---|---|---|---|---|
|`boolean`|`false`|`Boolean`|Z|8|
|`byte`|`0`|`Byte`|B|8|
|`short`|`0`|`Short`|S|16|
|`char`|`\u0000`|`Character`|C|16|
|`int`|`0`|`Integer`|I|32|
|`long`|`0L`|`Long`|J|64|
|`float`|`+0.0F`|`Float`|F|32|
|`double`|`+0.0D`|`Double`|D|64|

## class

```java
public class Human {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
```

## enum

@since 5 `public abstract class Enum<E extends Enum<E>>`

```java
public enum HumanGender {

    MALE("MALE"),
    FEMALE("FEMALE"),
    OTHER("OTHER");

    private final String name;

    HumanGender(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
```

## record

> @since 14 [JEP 359: Records (Preview)](https://openjdk.org/jeps/359)<br>
> @since 15 [JEP 384: Records (Second Preview)](https://openjdk.org/jeps/384)<br>
> @since 16 [JEP 395: Records](https://openjdk.org/jeps/395)

`public abstract class Record`

```java
// record 实现
public record HumanRecord(String name, int age) {
}

// class 实现
public class HumanClass {
    private final String name;
    private final int    age;

    public HumanClass(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String name() {
        return name;
    }

    public int age() {
        return age;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        HumanClass that = (HumanClass) o;
        return age == that.age && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public String toString() {
        return "HumanClass{" +
                "name='" + name + '\'' +
                ", age=" + age +
                '}';
    }
}
```

## sealed

> since 15 [JEP 360: Sealed Classes (Preview)](https://openjdk.org/jeps/360)<br>
> since 16 [JEP 397: Sealed Classes (Second Preview)](https://openjdk.org/jeps/397)<br>
> since 17 [JEP 409: Sealed Classes](https://openjdk.org/jeps/409)<br>

密封接口/类, 可控制由哪些子类实现.

```java
public sealed interface SealedInterface permits
        NonSealedClass,
        SealedFinalClass,
        SealedClass,
        SealedRecord {
}

// 第一种实现 non-sealed
public non-sealed class NonSealedClass implements SealedInterface {
}

// 第二种实现 final
public final class SealedFinalClass implements SealedInterface {
}

// 第三种实现 sealed, 但该类至少还需要一个子类
public sealed class SealedClass implements SealedInterface
        permits SealedSubClass {
}
public final class SealedSubClass extends SealedClass {
}

// 第四种实现 record, 因为 record 本身就是 final 的
public record SealedRecord() implements SealedInterface {
}
```

## 控制流

### if

> @since 14 [JEP 305: Pattern Matching for instanceof (Preview)](https://openjdk.org/jeps/305)<br>
> @since 15 [JEP 375: Pattern Matching for instanceof (Second Preview)](https://openjdk.org/jeps/375)<br>
> @since 16 [JEP 394: Pattern Matching for instanceof](https://openjdk.org/jeps/394)<br>

```java
var r = RandomGenerator.getDefault();
if (r.nextBoolean()) {
    System.out.println("Hello, world!");
} else {
    System.out.println("Goodbye, world!");
}

// @since 14
Object o = "Hello";
if (o instanceof String s) {
    System.out.println(s);
}
```

### switch

> @since 12 [JEP 325: Switch Expressions (Preview)](https://openjdk.org/jeps/325)<br>
> @since 13 [JEP 354: Switch Expressions (Second Preview)](https://openjdk.org/jeps/354)<br>
> @since 14 [JEP 361: Switch Expressions](https://openjdk.org/jeps/361)<br>

```java
var r = RandomGenerator.getDefault();
switch (r.nextInt(0, 2)) {
    case 0:
        System.out.println(0);
        break;
    case 1:
        System.out.println(1);
        break;
    default:
        System.out.println("default");
        break;
}

// @since 12 JEP 325: Switch Expressions (Preview)
switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> System.out.println(6);
    case TUESDAY                -> System.out.println(7);
    case THURSDAY, SATURDAY     -> System.out.println(8);
    case WEDNESDAY              -> System.out.println(9);
}

// @since 14
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY                -> 7;
    case THURSDAY, SATURDAY     -> 8;
    case WEDNESDAY              -> 9;
};

int j = switch (day) {
    case MONDAY  -> 0;
    case TUESDAY -> 1;
    default      -> {
        int k = day.toString().length();
        int result = f(k);

        // Yielding a value
        // 此处不可以使用 return
        // return 会导致后面代码不会继续执行
        // 所以使用一个新的关键字 yield 返回给 j
        yield result;
    }
};
```

### for

```java
// for 循环
var array = {0, 1, 2, 3};
for (int i : array) {
    // @since 5 foreach 循环
    System.out.println(i);
}
```

### while

```java
var r = RandomGenerator.getDefault();
while (r.nextBoolean()) {
    System.out.println("Hello, World!");
}
```