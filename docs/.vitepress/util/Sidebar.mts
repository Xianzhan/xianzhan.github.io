import type { DefaultTheme } from 'vitepress'

// 侧边栏 https://vitepress.dev/zh/reference/default-theme-sidebar
export const sidebar: DefaultTheme.Sidebar = {
    // Java
    '/Java/Java 基础/': [
        {
            text: 'Java',
            items: [
                { text: 'Java 基础', link: '/Java/Java 基础/Base' },
                { text: '字符串', link: '/Java/Java 基础/字符串' },
                { text: '日期时间', link: '/Java/Java 基础/日期时间' },
                { text: '集合框架', link: '/Java/Java 基础/集合框架' },
                { text: 'Java IO', link: '/Java/Java 基础/Java IO' },
                { text: '注解', link: '/Java/Java 基础/注解' },
            ]
        }
    ],
    '/Java/Java 并发/': [
        {
            text: 'Java 并发',
            items: [
                { text: '线程', link: '/Java/Java 并发/线程' },
                { text: '线程池', link: '/Java/Java 并发/线程池' },
                { text: '并发同步', link: '/Java/Java 并发/并发同步' },
                { text: '并发编排', link: '/Java/Java 并发/并发编排' },
                { text: '定时任务', link: '/Java/Java 并发/定时任务' },
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

};
