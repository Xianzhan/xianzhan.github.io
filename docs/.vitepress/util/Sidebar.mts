import type { DefaultTheme } from 'vitepress'

// 侧边栏 https://vitepress.dev/zh/reference/default-theme-sidebar
export const sidebar: DefaultTheme.Sidebar = {
    // Java
    '/Java/JavaBase/': [
        {
            text: 'Java',
            items: [
                { text: '基础', link: '/Java/JavaBase/Base' },
                { text: '字符串', link: '/Java/JavaBase/String' },
                { text: '日期时间', link: '/Java/JavaBase/DateTime' },
                { text: '泛型', link: '/Java/JavaBase/Generics' },
                { text: '集合框架', link: '/Java/JavaBase/CollectionFramework' },
                { text: 'IO', link: '/Java/JavaBase/IO' },
                { text: '网络编程', link: '/Java/JavaBase/Network' },
                { text: '注解', link: '/Java/JavaBase/Annotation' },
                { text: '类加载器', link: '/Java/JavaBase/ClassLoader' },
                { text: '反射', link: '/Java/JavaBase/Reflection' },
                { text: '代理', link: '/Java/JavaBase/Proxy' },
                { text: 'Lambda', link: '/Java/JavaBase/Lambda' },
            ]
        }
    ],
    '/Java/JavaConcurrency/': [
        {
            text: 'Java 并发',
            items: [
                { text: '线程', link: '/Java/JavaConcurrency/Thread' },
                { text: '线程池', link: '/Java/JavaConcurrency/ThreadPool' },
                { text: '并发同步', link: '/Java/JavaConcurrency/ConcurrentSync' },
                { text: '并发编排', link: '/Java/JavaConcurrency/ConcurrentOrchestration' },
                { text: '定时任务', link: '/Java/JavaConcurrency/ScheduledTasks' },
            ]
        }
    ],
    '/Java/JVM/': [
        {
            text: 'JVM',
            items: [
                { text: 'JVM 基础', link: '/Java/JVM/Base' },
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
                { text: '基础', link: '/Java/Spring/Base' },
                { text: '数据访问', link: '/Java/Spring/DataAccess' },
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
