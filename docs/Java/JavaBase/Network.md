# 网络编程

## ICMP

ICMP(Internet Control Message Protocol)协议通常用于网络设备之间的诊断，比如 `ping` 命令就是通过 ICMP 协议来实现的。

```java
// ping 8.8.8.8
// 检查 ip 是否能在 1000 毫秒内 ping 通
boolean reachable = InetAddress.getByAddress(new byte[]{8, 8, 8, 8})
        .isReachable(1000);
// reachable: true
```

## TCP

TCP(Transmission Control Protocol) 是面向连接的协议，提供可靠的、顺序的字节流服务。在 Java 中，`ServerSocket` 和 `Socket` 类是实现 TCP 协议的核心类。

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

## UDP

UDP(User Datagram Protocol) 是无连接的协议，提供简单、快速的通信方式，但不保证数据的可靠传输。在 Java 中，`DatagramSocket` 和 `DatagramPacket` 类用于实现 UDP 通信。

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

## HTTP

> @since 9 [JEP 110: HTTP/2 Client (Incubator)](https://openjdk.org/jeps/110)<br>
> @since 11 [JEP 321: HTTP Client API](https://openjdk.org/jeps/321)<br>

客户端示例

GET

```java
try (HttpClient client = HttpClient.newHttpClient()) {
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://www.baidu.com/"))
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("code: " + response.statusCode());
    System.out.println("body: " + response.body());
}
```

POST

```java
try (HttpClient client = HttpClient.newHttpClient()) {
    String json = "{\"title\":\"foo\",\"body\":\"bar\",\"userId\":1}";
    HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://httpbin.org/post"))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(json))
            .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    System.out.println("code: " + response.statusCode());
    System.out.println("body: " + response.body());
}
```
