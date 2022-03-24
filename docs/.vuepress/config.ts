import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  // base: '/zk-primer/',
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
    repo: 'egemengol/zero-knowledge-primer',
    repoLabel: 'Repo',
    docsDir: 'docs',
    lastUpdated: false,
    // contributors: false,
    // editLink: false,
    displayAllHeaders: true,
    sidebar: [
      {
        text: "Theory",
        children: [
          '/zk-theory',
          '/zk-theory/snark-vs-stark.md'
        ]
      }, {
        text: "Projects",
        children: [
          '/zk-projects',
        ]
      }, {
        text: "Misc",
        collapsible: true,
        children: [
          '/zk-credits.md',
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
