# 泛型

## 泛型类

```java
public class Response<T> {
    private Integer code;
    private String  message;
    private T       data;
}

public record Response<T>(Integer code, String message, T data) {
}
```

## 泛型方法

```java
public <E> void print(E[] arr) {
    for (E e : arr) {
        System.out.println(e);
    }
}
```
