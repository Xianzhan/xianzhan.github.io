# 容器

## List

```java
var list = new ArrayList<>();
// list: []

list.add(10);
list.add(11);
// list: [10, 11]

var eleven = list.get(1);
// eleven: 11
// list: [10, 11]

var ten = list.remove(0);
// ten: 10
// list: [11]
```

### ArrayList

`ArrayList` 是一个基于数组实现的列表，在容量不足时，会自动扩容，但不会自动缩容。

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    // 实际数据存储在 `elementData` 中
    transient Object[] elementData;
    // `size` 表示 `elementData` 中元素的数量
    private int size;
}
```

**接口**

- `List` - 列表实现，包含 `List` 接口的所有方法。
- `RandomAccess` - 表明 `ArrayList` 支持快速（通常是常量时间）随机访问。
- `Cloneable` - 克隆 `ArrayList`，返回一个新的 `ArrayList` 对象，元素也是之前的元素。
- `Serializable` - 可序列化 `ArrayList`，可以将对象转换为字节流进行持久化存储或网络传输。

### LinkedList

`LinkedList` 是一个基于双向链表实现的列表。

```java
public class LinkedList<E>
    extends AbstractSequentialList<E>
    implements List<E>, Deque<E>, Cloneable, java.io.Serializable
{
    // 实际数据存储在 `first` 和 `last` 中
    transient Node<E> first;
    transient Node<E> last;
    // `size` 表示 `first` 和 `last` 中元素的数量
    private int size;
}
```

## Set

```java
var set = new HashSet<>();
// set: []

set.add(11);
set.add(12);
set.add(13);
set.add(11);
// set: [11, 12, 13]

var removed = set.remove(11);
// removed: true
// set: [12, 13]
```

## Map

```java
var map = new HashMap<>();
// map: {}

map.put("1", 1);
map.put("2", 2);
map.put("3", 3);
map.put("1", 1);
// map: {1=1, 2=2, 3=3}

var one = map.remove("1");
// one: 1
// map: {2=2, 3=3}
```