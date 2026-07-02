# Spring AI 基础

## 描述

- [Spring AI](https://spring.io/projects/spring-ai)

Spring AI 是一个用于 AI 工程的应用框架。其目标是将 Spring 生态系统设计原则应用于 AI 领域，如可移植性和模块化设计，并推广将 POJO 作为应用构建模块到人工智能领域的应用。

Spring AI 的核心是解决人工智能集成的根本挑战：将**企业数据**和 **API** 与 **AI 模型连接**起来。

## 特征

- 支持所有主要的人工智能模型提供商，如 Anthropic、OpenAI、Microsoft、亚马逊、谷歌和 Ollama。支持的模型类型包括：
  - Chat Completion
  - Embedding
  - Text to Image
  - Audio Transcription
  - Text to Speech
  - Moderation
- 支持跨 AI 提供商的可移植 API 支持，支持同步和流式 API 选项，还可访问模型专属功能。
- 结构化输出，将 AI 模型输出映射到 POJO。
- 支持所有主流向量数据库提供商，如 Apache Cassandra、Neo4j、Oracle、PostgreSQL/PGVector、Redis 等。
- 跨向量存储提供商的可移植 API，包括一种新颖的类 SQL 元数据过滤 API。
- Tools/Function Calling 支持，允许模型请求执行客户端工具和函数，从而根据需要访问必要的实时数据。
- 支持聊天对话记忆和检索增强生成（Retrieval Augmented Generation, RAG）。

## 示例

### pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>xianzhan.github.io</groupId>
    <artifactId>spring-ai-ds</artifactId>
    <version>1.0</version>
    <packaging>pom</packaging>

    <properties>
        <maven.compiler.source>26</maven.compiler.source>
        <maven.compiler.target>26</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>

        <spring-ai.version>1.1.5</spring-ai.version>
    </properties>

    <modules>
        <module>ds-base</module>
    </modules>

    <dependencies>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-deepseek</artifactId>
        </dependency>
    </dependencies>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

### main

```java
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.deepseek.DeepSeekChatModel;
import org.springframework.ai.deepseek.DeepSeekChatOptions;
import org.springframework.ai.deepseek.api.DeepSeekApi;

public class Main {

    static void main() {
        String apiKey = System.getenv("DEEPSEEK_API_KEY");

        DeepSeekApi deepseekApi = DeepSeekApi.builder()
                .apiKey(apiKey)
                .build();

        DeepSeekChatOptions deepseekChatOptions = DeepSeekChatOptions.builder()
                .model(DeepSeekApi.ChatModel.DEEPSEEK_CHAT.getValue())
                .temperature(0.4)
                .maxTokens(200)
                .build();

        DeepSeekChatModel chatModel = DeepSeekChatModel.builder()
                .deepSeekApi(deepseekApi)
                .defaultOptions(deepseekChatOptions)
                .build();

        ChatResponse response = chatModel.call(new Prompt("你是谁？"));
        System.out.println(response.getResult().getOutput().getText());
    }
}
```

> 你好！我是DeepSeek，由深度求索公司创造的AI助手。我是一个纯文本模型，可以帮你解答问题、处理信息、进行对话等。我支持阅读链接、上传文件（包括图片、PDF、Word、Excel等），并从中提取文字信息。我的知识截止于2025年5月，目前是免费使用的，并且上下文长度达到1M，可以一次性处理像《三体》三部曲那样体量的书籍。
> 
> 有什么我可以帮你的吗？😊
