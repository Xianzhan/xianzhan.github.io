import type { DefaultTheme } from 'vitepress'

// 导航栏
export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Java 基础/Base' },
        ]
    },
    { text: 'Examples', link: '/markdown-examples' }
];

// 侧边栏
export const sidebar: DefaultTheme.Sidebar = {
    '/Java/Java 基础/': [
        {
            text: 'Java',
            items: [
                { text: 'Java 基础', link: '/Java/Java 基础/Base' },
                { text: '集合框架', link: '/Java/Java 基础/集合框架' }
            ]
        }
    ]
};
