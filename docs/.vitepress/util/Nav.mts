import type { DefaultTheme } from 'vitepress'

// 导航栏 https://vitepress.dev/zh/reference/default-theme-nav
export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Java 基础/Base' },
            { text: 'JVM', link: '/Java/JVM/Base' },
        ]
    },
    {
        text: 'Rust', items: [
            { text: 'Rust 基础', link: '/Rust/Rust 基础/Base' },
            { text: 'crate', link: '/Rust/crate/index' },
        ]
    },
];