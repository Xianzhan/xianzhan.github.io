import type { DefaultTheme } from 'vitepress'

// 侧边栏 https://vitepress.dev/zh/reference/default-theme-sidebar
export const sidebar: DefaultTheme.Sidebar = {
    // Java
    '/Java/Base/': [
        {
            text: 'Java',
            items: [
                { text: '基础', link: '/Java/Base/Base' },
                { text: '字符串', link: '/Java/Base/String' },
                { text: '时间', link: '/Java/Base/DateTime' },
                { text: '泛型', link: '/Java/Base/Generics' },
                { text: '容器', link: '/Java/Base/Container' },
                { text: '注解', link: '/Java/Base/Annotation' },
                { text: '类加载器', link: '/Java/Base/ClassLoader' },
                { text: '反射', link: '/Java/Base/Reflection' },
                { text: '代理', link: '/Java/Base/Proxy' },
                { text: 'Lambda', link: '/Java/Base/Lambda' },
                { text: '模块', link: '/Java/Base/Module' },
                { text: 'Unsafe', link: '/Java/Base/Unsafe' },
            ]
        }
    ],
    '/Java/Concurrency/': [
        {
            text: 'Java 并发',
            items: [
                { text: '并发基础', link: '/Java/Concurrency/Base' },
                { text: '线程', link: '/Java/Concurrency/Thread' },
                { 
                    text: '并发同步', link: '/Java/Concurrency/Sync/Base',
                    collapsed: true,
                    items: [
                        { text: '同步基础', link: '/Java/Concurrency/Sync/Base' },
                        { text: 'AQS', link: '/Java/Concurrency/Sync/AQS' },
                    ]
                },
                { text: '线程池', link: '/Java/Concurrency/ThreadPool' },
                { text: '并发编排', link: '/Java/Concurrency/ConcurrentOrchestration' },
                { text: '定时任务', link: '/Java/Concurrency/ScheduledTasks' },
            ]
        }
    ],
    '/Java/IO/': [
        {
            text: 'Java IO',
            items: [
                { text: 'IO 基础', link: '/Java/IO/Base' },
                { text: '网络编程', link: '/Java/IO/Network' },
                {
                    text: 'Feign', link: '/Java/IO/Feign/Base',
                    collapsed: true,
                    items: [
                        { text: 'Feign 基础', link: '/Java/IO/Feign/Base' },
                    ]
                },
            ]
        }
    ],
    '/Java/JVM/': [
        {
            text: 'JVM',
            items: [
                { text: '基础', link: '/Java/JVM/Base' },
                { text: '初始化', link: '/Java/JVM/Init' },
                { text: 'class 文件', link: '/Java/JVM/ClassFile' },
                { text: 'class 加载', link: '/Java/JVM/ClassLoading' },
                {
                    text: 'GC',
                    collapsed: true,
                    items: [
                        { text: 'GC 基础', link: '/Java/JVM/GC/Base' },
                    ]
                },
            ]
        }
    ],
    '/Java/Spring/': [
        {
            text: 'Spring',
            items: [
                {
                    text: 'Spring 基础', link: '/Java/Spring/Base/Base',
                    collapsed: true,
                    items: [
                        { text: '基础', link: '/Java/Spring/Base/Base' },
                        { text: '数据访问', link: '/Java/Spring/Base/DataAccess' },
                    ]
                },
            ]
        }
    ],
    '/Java/DataAccess/': [
        {
            text: '数据访问',
            items: [
                { text: 'JDBC', link: '/Java/DataAccess/JDBC' },
                { text: 'MyBatis', link: '/Java/DataAccess/MyBatis' },
            ]
        }
    ],

    // Python

    '/Python/Base/': [
        {
            text: 'Python',
            items: [
                { text: '基础', link: '/Python/Base/Base' },
            ]
        }
    ],

    // 服务
    '/Service/MySQL/': [
        {
            text: 'MySQL',
            items: [
                { text: '基础', link: '/Service/MySQL/Base' },
            ]
        }
    ],

    // 系统
    '/System/Network/': [
        {
            text: '网络',
            items: [
                { text: '网络基础', link: '/System/Network/Base' },
                { text: 'TCP', link: '/System/Network/TCP' },
            ]
        }
    ],
};
