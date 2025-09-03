# 集合框架

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