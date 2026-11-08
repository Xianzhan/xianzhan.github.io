# Netty 基础

## 简介

- [Netty 官网](https://netty.io/)

> Netty 是一个 NIO 客户端/服务器框架，它能够快速便捷地开发网络应用程序，例如协议服务器和客户端。它极大地简化和优化了网络编程，例如 TCP 和 UDP 套接字服务器。

## 示例

pom.xml

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.136.Final</version>
    <scope>compile</scope>
</dependency>
```

HttpServer.java

```java
import io.netty.bootstrap.ServerBootstrap;
import io.netty.buffer.Unpooled;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelFutureListener;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.DefaultFullHttpResponse;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.HttpHeaderNames;
import io.netty.handler.codec.http.HttpHeaderValues;
import io.netty.handler.codec.http.HttpMethod;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpResponseStatus;
import io.netty.handler.codec.http.HttpServerCodec;
import io.netty.handler.logging.LogLevel;
import io.netty.handler.logging.LoggingHandler;

import java.nio.charset.StandardCharsets;

public class HttpServer {

    static class Server {
        private final int port;

        Server(int port) {
            this.port = port;
        }

        void start() throws Exception {
            // accept 线程组
            EventLoopGroup bossGroup = new NioEventLoopGroup(1);
            // read/write 线程组
            EventLoopGroup workerGroup = new NioEventLoopGroup(8);

            try {
                ServerBootstrap b = new ServerBootstrap();
                b.group(bossGroup, workerGroup)
                        // IO 模型
                        .channel(NioServerSocketChannel.class)

                        // bossGroup 中的线程处理 accept 事件
                         .handler(new LoggingHandler(LogLevel.INFO))

                        // workerGroup 中的线程处理 HTTP & 业务处理 ServerInitializer
                        .childHandler(new ServerInitializer());

                ChannelFuture f = b.bind(port).sync();
                IO.println("服务已启动. port: " + port);

                f.channel().closeFuture().sync();
            } finally {
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        }
    }

    static class ServerInitializer extends ChannelInitializer<SocketChannel> {
        @Override
        protected void initChannel(SocketChannel ch) throws Exception {
            ChannelPipeline p = ch.pipeline();

            // HTTP 编解码器（处理请求行/header/body）
            p.addLast(new HttpServerCodec());
            // 转换成 FullHttpRequest/FullHttpResponse
            p.addLast(new HttpObjectAggregator(65536));
            // 业务处理
            p.addLast(new ServerHandler());
        }
    }

    static class ServerHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
        @Override
        protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest msg) throws Exception {
            IO.println("URI: " + msg.uri() + ", method: " + msg.method());

            // 响应内容
            String resContent;
            HttpResponseStatus status;
            if (msg.method() == HttpMethod.GET && "/".equals(msg.uri())) {
                resContent = "Hello Netty";
                status = HttpResponseStatus.OK;
            } else {
                resContent = "Not found";
                status = HttpResponseStatus.NOT_FOUND;
            }

            // 构建响应
            var res = new DefaultFullHttpResponse(
                    msg.protocolVersion(),
                    status,
                    Unpooled.copiedBuffer(resContent, StandardCharsets.UTF_8)
            );

            // 响应头
            res.headers()
                    .set(HttpHeaderNames.CONTENT_TYPE, HttpHeaderValues.TEXT_PLAIN)
                    .setInt(HttpHeaderNames.CONTENT_LENGTH, res.content().readableBytes());

            ctx.writeAndFlush(res)
                    // 关闭连接
                    // 如果不关闭，则会被复用，下次请求会被处理
                    .addListener(ChannelFutureListener.CLOSE);
        }

        @Override
        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
            cause.printStackTrace();
            ctx.close();
        }
    }

    void main() throws Exception {
        var s = new Server(8080);
        s.start();
    }
}
```
