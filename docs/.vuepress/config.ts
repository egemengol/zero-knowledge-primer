import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  base: '/zero-knowledge-primer/',
  lang: 'en-US',
  title: 'Zero Knowledge Primer',
  description: 'A high level look to ZK',
  head: [
    ['link', { rel: 'icon', href: '/images/logo.png' }]
  ],

  // theme and its config
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/images/logo.png',
    repo: 'vuejs/vuepress',
    repoLabel: 'Repo',
    displayAllHeaders: true,
    sidebar: [
      {
        text: "Theory",
        children: [
          '/theory',
          '/theory/compare.md'
        ]
      }, {
        text: "Projects",
        children: [
          '/projects',
        ]
      }, {
        text: "Misc",
        collapsible: true,
        children: [
          '/credits.md',
        ]
      }
    ],
    navbar: [
      {
        text: 'GitHub',
        link: 'https://github.com/egemengol',
      },
      {
        text: 'LinkedIn',
        link: 'https://www.linkedin.com/in/egemen-gol/',
      },
    ],
  },
})
