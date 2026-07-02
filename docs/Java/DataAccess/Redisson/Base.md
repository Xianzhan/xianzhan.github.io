# Redisson 基础

## 简介

Redisson 是一个功能全面的 Java 客户端库和实时数据平台，适用于 Redis 和 Valkey 数据库。它在 Redis/Valkey 和 Java 代码之间提供了一个抽象层，使开发人员能够通过熟悉的 Java 接口操作分布式数据结构和服务，而实际数据存储在 Redis/Valkey 中。

## 示例

```java
RedissonClient redissonClient = Redisson.create();

RBucket<String> bucket = redissonClient.getBucket("key");
bucket.set("value");
System.out.println(bucket.get());
// value
```