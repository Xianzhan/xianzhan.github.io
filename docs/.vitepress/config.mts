import { defineConfig } from 'vitepress'
import { nav } from './util/Nav.mts'
import { sidebar } from './util/Sidebar.mts'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/",

  title: "Xianzhan's Site",
  description: "A VitePress Site",

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Xianzhan' }
    ],

    // https://vitepress.dev/zh/reference/default-theme-config#outline
    outline: {
      // On this page
      label: '目录',
      level: [2, 3],
    }
  },

  markdown: {
    // https://vitepress.dev/zh/guide/markdown#line-numbers
    lineNumbers: true,
    // https://vitepress.dev/zh/guide/markdown#math-equations
    math: true,
    // https://vitepress.dev/zh/guide/markdown#image-lazy-loading
    image: {
      lazyLoading: true,
    },
  }
})
