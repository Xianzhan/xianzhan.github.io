# Shiro 基础

## 概述

Apache Shiro 是一个功能强大且易于使用的 Java 安全框架，可执行身份验证（Authentication）、授权（Authorization）、加密（Cryptography）和会话管理（Session Management）。Shiro 拥有易于理解的 API，您可以快速、轻松地获得任何应用程序——从最小的移动应用程序到最大的网络和企业应用程序。

## 核心

- `Subject` 主体：当前与系统交互的 '用户'，可以是人、第三方服务、守护进程等。
- `SecurityManager` 安全管理器：Shiro 核心，管理所有 `Subject`，协调各组件。
- `Realm` 域：连接 Shiro 与系统数据（数据库、配置文件）的桥梁。

```java
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.mgt.DefaultSecurityManager;
import org.apache.shiro.realm.SimpleAccountRealm;
import org.apache.shiro.subject.Subject;

public class Main {

    public static void main(String[] args) throws Exception {
        // 1. Realm 用户数据处理
        SimpleAccountRealm realm = new SimpleAccountRealm();
        realm.addAccount("user1", "password1", "role1");

        // 2. SecurityManager 创建
        DefaultSecurityManager defaultSecurityManager = new DefaultSecurityManager();
        defaultSecurityManager.setRealm(realm);
        SecurityUtils.setSecurityManager(defaultSecurityManager);

        // 3. Subject 主体提交认证请求
        Subject subject = SecurityUtils.getSubject();
        if (!subject.isAuthenticated()) {
            System.out.println("未登录");

            UsernamePasswordToken token = new UsernamePasswordToken("user1", "password1");
            token.setRememberMe(true);
            subject.login(token);

            System.out.println(subject.getPrincipal());
            // user1
            System.out.println(subject.hasRole("role1"));
            // true
            System.out.println(subject.isPermitted("permission1"));
            // false

            subject.logout();
        }
    }
}
```