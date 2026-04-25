import type { DefaultTheme } from 'vitepress'

// 导航栏 https://vitepress.dev/zh/reference/default-theme-nav
export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Base/Base' },
            { text: 'Java 并发', link: '/Java/Concurrency/Base' },
            { text: 'Java IO', link: '/Java/IO/Base' },
            { text: 'JVM', link: '/Java/JVM/Base' },
            { text: 'Spring', link: '/Java/Spring/Base/Base' },
            { text: '数据访问', link: '/Java/DataAccess/JDBC' },
        ]
    },
    {
        text: 'AI', items: [
            { text: 'AI 基础', link: '/AI/Base/Base' },
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