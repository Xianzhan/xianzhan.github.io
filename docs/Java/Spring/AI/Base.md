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