# 数据访问

## 事务管理

### 本地事务

本地事务是特定于资源的，例如与 JDBC 连接关联的事务。本地事务可能更易于使用，但有一个明显的缺点：它们**无法跨多个事务资源运行**。例如，使用 JDBC 连接管理事务的代码无法在全局 JTA 事务中运行。由于应用服务器不参与事务管理，因此它无法帮助确保跨多个资源的正确性。（值得注意的是，大多数应用程序都使用单个事务资源。）另一个缺点是本地事务会侵入编程模型。

pom.xml

```xml
<dependencies>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-context -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>3.2.18.RELEASE</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-tx -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>3.2.18.RELEASE</version>
    </dependency>
    <!-- https://mvnrepository.com/artifact/org.springframework/spring-jdbc -->
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>3.2.18.RELEASE</version>
    </dependency>
    <!-- MySQL 驱动 -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>5.1.47</version>
    </dependency>
</dependencies>
```

配置类

```java
package io.github.xianzhan.test.spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
// 事务管理
@EnableTransactionManagement
// 扫描业务类
@ComponentScan("io.github.xianzhan.test.spring.*")
public class DatabaseConfig {

    @Bean
    public DataSource dataSource() {
        // 配置数据源
        DriverManagerDataSource ds = new DriverManagerDataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://your.database.ip:3306/db");
        ds.setUsername("username");
        ds.setPassword("password");

        return ds;
    }

    @Bean
    public DataSourceTransactionManager transactionManager() {
        // 配置事务管理器
        return new DataSourceTransactionManager(dataSource());
    }

    @Bean
    public JdbcTemplate jdbcTemplate() {
        // 配置执行引擎 JdbcTemplate，可选
        return new JdbcTemplate(dataSource());
    }
}
```

业务类

接口

```java
package io.github.xianzhan.test.spring.service;

public interface IDBService {

    void programmaticTransactions();

    void declarativeTransactions();
}
```

实现

```java
package io.github.xianzhan.test.spring.service.impl;

import io.github.xianzhan.test.spring.service.IDBService;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;

import javax.annotation.Resource;

@Service
public class DBServiceImpl implements IDBService {

    @Resource
    private JdbcTemplate jdbcTemplate;
    @Resource
    private PlatformTransactionManager transactionManager;

    @Override
    public void programmaticTransactions() {
        // 编程式事务

        // 1. 定义事务属性
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);

        // 2. 开启事务
        TransactionStatus ts = transactionManager.getTransaction(def);

        try {
            // 3. 执行数据库更新操作
            jdbcTemplate.update("update t_user set memo = ? where id = ?", "programmaticTransactions", 1);
            jdbcTemplate.update("update t_user set memo = ? where id = ?", "programmaticTransactions", 2);

            // 4. 提交事务
            transactionManager.commit(ts);
        } catch (Exception ex) {
            // 5. 发生异常回滚
            transactionManager.rollback(ts);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void declarativeTransactions() {
        // 声明式事务

        // 1. 执行数据库更新操作
        jdbcTemplate.update("update t_user set memo = ? where id = ?", "declarativeTransactions", 3);
        jdbcTemplate.update("update t_user set memo = ? where id = ?", "declarativeTransactions", 4);
    }
}
```

main

```java
package io.github.xianzhan.test;

import io.github.xianzhan.test.spring.config.DatabaseConfig;
import io.github.xianzhan.test.spring.service.IDBService;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {

    public static void main(String[] args) {
        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext(DatabaseConfig.class);

        IDBService db = ctx.getBean(IDBService.class);
        // db.programmaticTransactions();
        db.declarativeTransactions();
    }
}
```
