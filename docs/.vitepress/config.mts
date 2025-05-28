import { defineConfig } from 'vitepress'
import { nav, sidebar } from './X.mts'

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
    ]
  }
})
