# 代理

## 静态代理

- 代理类需要手动编写，实现与目标对象相同的接口
- 在编译时就已经确定代理关系

示例

```java
// 接口定义
public interface IService {
    void print();
}
```
```java
// 目标对象
public class AService implements IService {
    @Override
    public void print() {
        System.out.println("AService#print");
    }
}
```
```java
// 静态代理类
public class IServiceStaticProxy implements IService {

    private final IService target;
    public IServiceStaticProxy(IService target) {
        this.target = target;
    }

    @Override
    public void print() {
        System.out.println("IServiceStaticProxy::before");
        target.print();
        System.out.println("IServiceStaticProxy::after");
    }
}
```
```java
public static void main(String[] args) {
    // 测试代码
    IService target = new AService();
    IService proxy = new IServiceStaticProxy(target);
    proxy.print();
    // IServiceStaticProxy::before
    // AService#print
    // IServiceStaticProxy::after
}
```

## 动态代理

- 代理类在运行时动态生成
- 灵活，可复用，减少代码冗余
- 只能代理实现了接口的类

示例

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;

// 动态代理类
public class DynamicProxyHandler implements InvocationHandler {

    private final Object target;

    public DynamicProxyHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("DynamicProxyHandler::before");
        Object result = method.invoke(target, args);
        System.out.println("DynamicProxyHandler::after");
        return result;
    }
}
```

```java
public static void main(String[] args) {
    IService target = new AService();
    IService proxy = (IService) Proxy.newProxyInstance(AService.class.getClassLoader(),
            AService.class.getInterfaces(),
            new DynamicProxyHandler(target)
    );
    proxy.print();
    // DynamicProxyHandler::before
    // AService#print
    // DynamicProxyHandler::after
}
```