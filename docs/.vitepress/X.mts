import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.NavItem[] = [
    { text: 'Home', link: '/' },
    {
        text: 'Java', items: [
            { text: 'Java 基础', link: '/Java/Java 基础' },
        ]
    },
    { text: 'Examples', link: '/markdown-examples' }
];

export const sidebar: DefaultTheme.Sidebar = {
    '/Java/': [
        {
            text: 'Java',
            items: [
                { text: 'Java 基础', link: '/Java/Java 基础' }
            ]
        }
    ]
};