import type { DefaultTheme } from 'vitepress'

// 导航栏 https://vitepress.dev/zh/reference/default-theme-nav
export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Java 基础/Base' },
            { text: 'Java 并发', link: '/Java/Java 并发/线程' },
            { text: 'JVM', link: '/Java/JVM/Base' },
            { text: 'Spring', link: '/Java/Spring/Base' },
        ]
    },
    {
        text: '服务', items: [
            { text: 'MySQL', link: '/Service/MySQL/Base' },
        ]
    },
    {
        text: '系统', items: [
            { text: '网络', link: '/System/Network/Base' },
        ]
    },
];