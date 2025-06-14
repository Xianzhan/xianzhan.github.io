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