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
            ]
        }
    ],
    '/Java/JVM/': [
        {
            text: 'JVM',
            items: [
                { text: 'JVM 基础', link: '/Java/JVM/Base' },
            ]
        }
    ],

    // Rust
    '/Rust/Rust 基础/': [
        {
            text: 'Rust',
            items: [
                { text: 'Rust 基础', link: '/Rust/Rust 基础/Base' },
            ]
        }
    ],
    '/Rust/crate/': [
        {
            text: 'Rust',
            items: [
                { text: 'crate', link: '/Rust/crate/index' },
                { text: 'axum', link: '/Rust/crate/axum' },
            ]
        }
    ],
};
