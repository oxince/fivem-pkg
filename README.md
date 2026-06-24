# fivem-pkg

**Download and update FiveM server artifacts (FXServer builds) from the command line, one command per branch.**

![npm](https://img.shields.io/npm/v/fivem-pkg) ![downloads](https://img.shields.io/npm/dt/fivem-pkg) ![License: MIT](https://img.shields.io/badge/License-MIT-green)

`fivem-pkg` is a CLI artifact updater for FiveM. It downloads FXServer artifacts, the binaries you need to run a FiveM server, straight from your terminal. Point it at a folder, choose the `recommended`, `optional` or `latest` branch, and it pulls that build for you. It works the same way on Windows and Linux, so updating a server build is one command on either OS. Inspired by [`altv-pkg`](https://github.com/altmp/altv-pkg).

## Install
```bash
npm i --save-dev fivem-pkg
```

## Usage
```bash
npx fivem-pkg -o ./artifacts
```

### Options
| Flag | Description | Default |
|------|-------------|---------|
| `-o <dir>` | Output directory for the artifacts | `artifacts` |
| `-v <version>` | Branch to download: `recommended`, `optional` or `latest` | `recommended` |

### Examples
```bash
# recommended build into ./server/artifacts
npx fivem-pkg -o ./server/artifacts -v recommended

# latest build
npx fivem-pkg -o ./artifacts -v latest
```

Add it to a script in your `package.json` so updating your server build is one command:
```json
{ "scripts": { "artifacts": "fivem-pkg -o ./server/artifacts -v recommended" } }
```

## Why use it
Most guides for how to update FXServer artifacts still tell you to download a zip by hand, unpack it, and copy files over. That breaks the moment you automate anything. `fivem-pkg` does the same job in a single command, which is what you want in a deploy pipeline, a fresh server setup, or a reproducible Docker build.

## recommended vs optional vs latest
- `recommended`: the build FiveM marks as stable. This is the default and the safe choice for a live server.
- `optional`: a newer build that has not been promoted to recommended yet. Use it if you need a fix or feature that landed after the recommended cut.
- `latest`: the newest artifact available. Good for testing, less safe for production.

## Built by oxince
`fivem-pkg` is built and maintained by **[oxince](https://oxince.com)**, a FiveM developer in Frankfurt who works with servers worldwide and builds custom scripts, web dashboards and server optimization for FiveM.

Need a custom script or your server optimized? **→ [oxince.com](https://oxince.com)**

## License
MIT © [oxince](https://oxince.com)
