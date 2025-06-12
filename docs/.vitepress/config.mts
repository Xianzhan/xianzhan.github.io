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
    ]
  }
})
