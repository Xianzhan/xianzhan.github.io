# MyBatis 基础

## 文档

[MyBatis 3 | 简介](https://mybatis.org/mybatis-3/zh_CN/index.html)

## 示例

项目结构

```sh
src/
  main/
    java/
      entity/
        User.java
      mapper/
        UserMapper.java
      Main.java
  resources/
    mybatis/
      mapper/
        UserMapper.xml
      config.xml
pom.xml
```

pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>io.github.xianzhan</groupId>
    <artifactId>mybatis-test</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>25</maven.compiler.source>
        <maven.compiler.target>25</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- https://mvnrepository.com/artifact/com.mysql/mysql-connector-j -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>9.4.0</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.9</version>
        </dependency>
    </dependencies>
</project>
```

src/main/resources/mybatis/config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">

<configuration>
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.cj.jdbc.Driver"/>
                <property name="url" value="jdbc:mysql://ip:3306/table_name?serverTimezone=UTC&amp;characterEncoding=utf-8&amp;useSSL=false"/>
                <property name="username" value="username"/>
                <property name="password" value="password"/>
            </dataSource>
        </environment>
    </environments>
    <mappers>
        <mapper resource="mybatis/mapper/UserMapper.xml"/>
    </mappers>
</configuration>
```

src/main/resources/mybatis/mapper/UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="mapper.UserMapper">
    <select id="selectById" resultType="entity.User">
        select id, name from t_user where id = #{id}
    </select>
</mapper>
```

src/main/java/entity/User.java

```java
package entity;

public class User {

    private Long id;
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```

src/main/java/mapper/UserMapper.java

```java
package mapper;

import entity.User;

public interface UserMapper {

    User selectById(Long id);
}
```

src/main/java/

```java
import entity.User;
import mapper.UserMapper;
import org.apache.ibatis.builder.xml.XMLConfigBuilder;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

void main() throws IOException {
    SqlSessionFactory sessionFactory;
    // 1. 加载配置
    try (InputStream is = Resources.getResourceAsStream("mybatis/config.xml")) {
        XMLConfigBuilder configBuilder = new XMLConfigBuilder(is);
        Configuration config = configBuilder.parse();
        sessionFactory = new SqlSessionFactoryBuilder().build(config);
    }

    // 2. 获取 session
    try (SqlSession session = sessionFactory.openSession()) {
        // 3. 执行操作
        User user = session.selectOne("mapper.UserMapper.selectById", 10L);
        System.out.println(user);
    }

    // 2. 获取 mapper session
    try (SqlSession session = sessionFactory.openSession()) {
        // 3. 获取 mapper
        UserMapper userMapper = session.getMapper(UserMapper.class);
        // 4. 执行操作
        User user = userMapper.selectById(10L);
        System.out.println(user);
    }
}
```
