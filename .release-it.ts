import type { Config } from "release-it";

export default {
  git: {
    tagName: "${version}",
  },
  github: {
    release: true,
    releaseName: "matchnull ${version}",
    assets: ["dist/*.jsx"],
  },
  npm: {
    publish: false,
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: "angular",
      infile: "changelog.md",
    },
  },
} satisfies Config;
