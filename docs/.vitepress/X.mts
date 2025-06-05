import type { DefaultTheme } from 'vitepress'

// 导航栏
export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Java 基础/Base' },
        ]
    },
    {
        text: 'Rust', items: [
            { text: 'Rust 基础', link: '/Rust/Rust 基础/Base' },
            { text: 'crate', link: '/Rust/crate/index' },
        ]
    },
];

// 侧边栏
export const sidebar: DefaultTheme.Sidebar = {
    // Java
    '/Java/Java 基础/': [
        {
            text: 'Java',
            items: [
                { text: 'Java 基础', link: '/Java/Java 基础/Base' },
                { text: '集合框架', link: '/Java/Java 基础/集合框架' }
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
