import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { prismjsPlugin } from "@vuepress/plugin-prismjs";

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
    lastUpdated: false,

    sidebar: [
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
        text: "Spread",
        children: ["/spread/introduction.md", "/spread/chatroom.md"],
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
  plugins: [
    prismjsPlugin({
      // // Choose a theme (you can select from many available themes)
      // theme: "one-dark", // A popular dark theme

      // // Or use light/dark themes based on user preference
      themes: {
        light: "one-light",
        // light: "material-light",

        dark: "one-dark",
        // dark: "material-oceanic",
      },

      // // Enable line numbers (true by default)
      // lineNumbers: true,

      // // Enable highlighting specific lines
      // highlightLines: true,

      // // Enable code collapsing (disabled by default)
      // collapsedLines: false,

      // // Enable diff notation
      // notationDiff: true,

      // // Enable focus notation
      // notationFocus: true,

      // // Enable highlight notation
      // notationHighlight: true,

      // // Enable error/warning level
      // notationErrorLevel: true,

      // // Enable word highlighting
      // notationWordHighlight: true,

      // // Display whitespace
      // whitespace: false,

      // Pre-load commonly used languages to avoid loading issues
      preloadLanguages: [
        "golang",
        "go",
        // "javascript",
        // "typescript",
        // "bash",
        // "markdown",
        // "json",
        // "yaml",
        // "css",
        // "html",
      ],
    }),
  ],
});
