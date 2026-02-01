# 反射

## 作用

反射允许程序在运行时检查类和修改类、接口、字段、方法和构造器的信息，并能动态地创建对象、调用方法、操作字段等，即使这些字段是私有的。

## 使用场景

1. 获取其 `Class` 对象
2. 动态创建实例
3. 访问并修改私有字段
4. 调用方法

```java
public class Person {
    private String name;
    private int    age;

    public Person() {
        this.name = "Unknown";
        this.age = 0;
    }

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

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

    private void celebrateBirthday() {
        age++;
        System.out.println("Happy Birthday, " + name + "! You are now " + age + " years old.");
    }

    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + '}';
    }
}
```

```java
public static void main(String[] args) throws Exception {
    // 1. 获取Class对象
    Class<?> personClass = Class.forName("Person");

    // 2. 创建对象实例
    Object personDefault = personClass.getDeclaredConstructor().newInstance();
    // personDefault: Person{name='Unknown', age=0}

    Constructor<?> paramConstructor = personClass.getDeclaredConstructor(String.class, int.class);
    Object person = paramConstructor.newInstance("Alice", 30);
    // person: Person{name='Alice', age=30}

    // 3. 访问和修改公有字段/方法
    Method setNameMethod = personClass.getMethod("setName", String.class);
    setNameMethod.invoke(person, "Bob");
    // person: Person{name='Bob', age=30}
    Method getNameMethod = personClass.getMethod("getName");
    String name = (String) getNameMethod.invoke(person);
    // name: Bob

    // 4. 访问和修改私有字段
    Field ageField = personClass.getDeclaredField("age");
    ageField.setAccessible(true);
    int currentAge = (int) ageField.get(person);
    // currentAge: 30
    ageField.set(person, 35);
    // person: Person{name='Bob', age=35}

    // 5. 调用私有方法：关键方法
    Method birthdayMethod = personClass.getDeclaredMethod("celebrateBirthday");
    birthdayMethod.setAccessible(true);
    birthdayMethod.invoke(person);
    // Happy Birthday, Bob! You are now 36 years old.
}
```
