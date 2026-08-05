import type { Config } from "release-it";

export default {
  git: {
    tagName: "v${version}",
  },
  github: {
    release: true,
    releaseName: "matchnull ${version}",
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: "angular",
      infile: "changelog.md",
    },
  },
} satisfies Config;
