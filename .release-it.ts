import type { Config } from "release-it";

export default {
  git: {
    tagName: "${version}",
    commitMessage: "chore: Release matchnull ${version}",
  },
  github: {
    release: true,
    releaseName: "matchnull ${version}",
    assets: ["dist/*.jsx"],
  },
  npm: false,
  plugins: {
    "@release-it/bumper": {
      in: "package.json",
      out: "package.json",
    },
    "@release-it/conventional-changelog": {
      preset: "angular",
      infile: "changelog.md",
    },
  },
} satisfies Config;
