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

## 网络

### ICMP

```java
// ping 8.8.8.8
// 检查 ip 是否能在 1000 毫秒内 ping 通
boolean reachable = InetAddress.getByAddress(new byte[]{8, 8, 8, 8})
        .isReachable(1000);
// reachable: true
```

### TCP

```java
public class Main {

    private static final int PORT = 8080;

    public static class EchoServer implements Runnable {
        @Override
        public void run() {
            try (ServerSocket serverSocket = new ServerSocket(PORT)) {
                for (; ; ) {
                    // accept 阻塞
                    try (Socket socket = serverSocket.accept()) {
                        // 获取客户端传输数据
                        BufferedReader br = new BufferedReader(
                                new InputStreamReader(
                                        socket.getInputStream()));
                        String echo = br.readLine();
                        System.out.println("Server: " + echo);

                        // 响应客户端传输数据
                        BufferedWriter bw = new BufferedWriter(
                                new OutputStreamWriter(
                                        socket.getOutputStream()));
                        bw.write(echo);
                        bw.newLine();
                        bw.flush();
                    }
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static class EchoClient implements Runnable {
        @Override
        public void run() {
            for (; ; ) {
                try (Socket socket = new Socket("localhost", PORT)) {
                    // 发送服务端数据
                    BufferedWriter bw = new BufferedWriter(
                            new OutputStreamWriter(
                                    socket.getOutputStream()));
                    // 发送当前时间戳
                    bw.write(Long.toString(System.currentTimeMillis()));
                    bw.newLine();
                    // 刷新确保数据发送
                    bw.flush();

                    BufferedReader br = new BufferedReader(
                            new InputStreamReader(
                                    socket.getInputStream()));
                    String echo = br.readLine();
                    System.out.println("Client: " + echo);

                    TimeUnit.SECONDS.sleep(1L);

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Thread server = new Thread(new EchoServer());
        server.start();

        Thread client = new Thread(new EchoClient());
        client.start();

        client.join();
        server.join();
    }
}
```

### UDP

```java
public class Main {

    private static final int PORT = 8080;
    /**
     * UDP 单次传输不超过 64KB
     */
    private static final int BUFFER_SIZE = 64 * 1024;

    public static class EchoServer implements Runnable {
        @Override
        public void run() {
            try (DatagramSocket datagramSocket = new DatagramSocket(PORT)) {
                for (; ; ) {
                    DatagramPacket receivePacket = new DatagramPacket(
                        new byte[BUFFER_SIZE], BUFFER_SIZE);
                    // 阻塞
                    datagramSocket.receive(receivePacket);

                    String message = new String(
                        receivePacket.getData(), 0, receivePacket.getLength());
                    System.out.println("Server: " + message);

                    DatagramPacket responsePacket = new DatagramPacket(
                            receivePacket.getData(),
                            receivePacket.getLength(),
                            receivePacket.getSocketAddress()
                    );
                    datagramSocket.send(responsePacket);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static class EchoClient implements Runnable {
        @Override
        public void run() {
            try (DatagramSocket datagramSocket = new DatagramSocket()) {
                for (; ; ) {
                    byte[] data = "Hello World!".getBytes(StandardCharsets.UTF_8);
                    DatagramPacket responsePacket = new DatagramPacket(
                            data,
                            data.length,
                            new InetSocketAddress("localhost", PORT)
                    );
                    datagramSocket.send(responsePacket);

                    DatagramPacket receivePacket = new DatagramPacket(
                        new byte[BUFFER_SIZE], BUFFER_SIZE);
                    // 阻塞
                    datagramSocket.receive(receivePacket);

                    String message = new String(
                        receivePacket.getData(), 0, receivePacket.getLength());
                    System.out.println("Client: " + message);

                    TimeUnit.SECONDS.sleep(1L);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Thread server = new Thread(new EchoServer());
        server.start();

        Thread client = new Thread(new EchoClient());
        client.start();

        client.join();
        server.join();
    }
}
```