# JDBC

## 规范

JDBC(Java Database Connectivity) 是 SUN 公司制定的一个 Java 数据库连接标准，它定义了 Java 程序如何通过 JDBC 接口来访问数据库。

## 示例

### 表结构

```sql
CREATE TABLE `k_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `user_id` varchar(20) NOT NULL COMMENT '用户id',
  `user_name` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `email` varchar(255) NOT NULL COMMENT '电子邮箱',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='用户表'
```

### 代码

pom.xml

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>9.0.0</version>
</dependency>
```

JDBCMain.java

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class JDBCMain {

    private static Connection conn;

    static void main() throws SQLException {
        final var url = "jdbc:mysql://127.0.0.1:3306/table_name";
        final var username = "username";
        final var password = "password";

        conn = DriverManager.getConnection(url, username, password);
        var preparedStatement = conn.prepareStatement(
                "select * from k_user where id > ?");
        preparedStatement.setInt(1, 1);
        var resultSet = preparedStatement.executeQuery();
        while (resultSet.next()) {
            String msg = """
                    id: %d, user_id: %d
                    """.formatted(resultSet.getInt("id"), resultSet.getInt("user_id"));
            System.out.print(msg);
        }

        insert(124);
    }

    private static void insert(int userId) throws SQLException {
        String iSql = """
                insert into k_user (user_id, user_name, password, email, create_time) value (?, 'test', 'test', 'test', '2025-12-24 20:00:00')
                """;
        // 设置插入数据时返回自增 ID
        var preparedStatement = conn.prepareStatement(iSql, Statement.RETURN_GENERATED_KEYS);
        preparedStatement.setInt(1, userId);
        var update = preparedStatement.executeUpdate();
        System.out.println(update);

        var generatedKeys = preparedStatement.getGeneratedKeys();
        var metaData = generatedKeys.getMetaData();
        var columnCount = metaData.getColumnCount();
        var builder = new StringBuilder();
        while (generatedKeys.next()) {
            while (columnCount > 0) {
                var columnName = metaData.getColumnName(columnCount);
                var string = generatedKeys.getString(columnName);
                builder.append(columnName)
                        .append(':')
                        .append(string)
                        .append("  ");
                columnCount--;
            }
        }
        System.out.println(builder);
    }
}

```