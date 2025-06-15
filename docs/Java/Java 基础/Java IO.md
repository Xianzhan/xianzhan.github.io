# Java IO

## 目录文件

```java
// `C:\development\project\java\misc>java Main`
Path root = Paths.get("/");
// root: C:\

Path dir = Paths.get("");
// dir: C:\development\project\java\misc

Path testFile = dir.resolve("test.txt");
// testFile: C:\development\project\java\misc\test.txt
try (BufferedWriter writer = Files.newBufferedWriter(testFile)) {
    writer.write("Hello world");
}
String content = Files.readString(testFile);
// content: "Hello world"
```

## 网络

### ICMP

```java
// ping 8.8.8.8
// 检查 ip 是否能在 1000 毫秒内 ping 通
boolean reachable = InetAddress.getByAddress(new byte[]{8, 8, 8, 8})
        .isReachable(1000);
// reachable: true
```
