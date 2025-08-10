# Java IO

## 概览

||基于字节输入|基于字节输出|基于字符输入|基于字符输出|
|---|---|---|---|---|
|基础|InputStream|OutputStream|Reader|Writer|
|数组|ByteArrayInputStream|ByteArrayOutputStream|CharArrayReader|CharArrayWriter|
|文件|FileInputStream|FileOutputStream|FileReader|FileWriter|
|管道|PipedInputStream|PipedOutputStream|PipedReader|PipedWriter|
|缓冲|BufferedInputStream|BufferedOutputStream|BufferedReader|BufferedWriter|
|过滤|FilterInputStream|FilterOutputStream|FilterReader|FilterWriter|
|字符串|||StringReader|StringWriter|
|数据|DataInputStream|DataOutputStream|||
|打印||PrintStream||PrintWriter|
|对象|ObjectInputStream|ObjectOutputStream|||
|转换|||InputStreamReader|OutputStreamWriter|

## 数组

### ByteArrayInputStream

```java
OutputStream os = // data 传输的目的输出流
byte[] data = // 数据源获取的 byte 数组数据
// 转为 ByteArrayInputStream 类型处理
InputStream is = new ByteArrayInputStream(data);
is.transferTo(os);
```

### ByteArrayOutputStream

```java
var os = new ByteArrayOutputStream();
os.write("Hello world".getBytes(StandardCharsets.UTF_8));
byte[] ba = os.toByteArray();
// ba: [72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

### CharArrayReader

```java
char[] data = "123456789".toCharArray();
CharArrayReader car = new CharArrayReader(data);
char[] target = "hello".toCharArray();
car.read(target);
// target: ['1', '2', '3', '4', '5']
```

### CharArrayWriter

```java
CharArrayWriter caw = new CharArrayWriter();
caw.write("Hello ");
caw.write("world");
char[] ca = caw.toCharArray();
// ca: ['H', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
```

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
