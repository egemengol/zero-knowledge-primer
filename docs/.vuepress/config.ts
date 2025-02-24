import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";

export default defineUserConfig({
  bundler: viteBundler(),
  // site config
  // base: '/zk-primer/',
  lang: "en-US",
  title: "Zero Knowledge Primer",
  description: "A high level look to ZK",
  head: [["link", { rel: "icon", href: "/images/logo.png" }]],
  //TODO: MATHJAX!!!!

  theme: defaultTheme({
    logo: "/images/logo.png",
    repo: "egemengol/zero-knowledge-primer",
    repoLabel: "Repo",
    docsDir: "docs",
    lastUpdated: true,
    // contributors: false,
    // editLink: false,
    displayAllHeaders: true,

    sidebar: [
      // {
      //   text: "Theory",
      //   children: [
      //     '/zk-theory',
      //     '/zk-theory/snark-vs-stark.md'
      //   ]
      // },
      {
        text: "Summaries",
        children: [
          "/summaries/zokrates.md",
          "/summaries/mina.md",
          "/summaries/zk-rollups.md",
          "/summaries/starknet-cairo.md",
        ],
      },
      {
        text: "ZkPassport",
        children: [
          "/zk-passport/domain.md",
          "/zk-passport/variation.md",
          "/zk-passport/techniques.md",
          "/zk-passport/combining.md",
          "/zk-passport/links.md",
        ],
      },
      {
        text: "Misc",
        collapsible: true,
        children: ["/zk-credits.md"],
      },
    ],
    navbar: [
      {
        text: "GitHub",
        link: "https://github.com/egemengol",
      },
      {
        text: "LinkedIn",
        link: "https://www.linkedin.com/in/egemen-gol/",
      },
    ],
  }),
});
