# matchnull

Adobe After Effects script for creating a null layer as a parent

This script is a standalone script, not a UI panel script. It can be run via the After Effects File > Run Scripts menu, or added to a bar such as [AEBar](https://motionfun.net/tools/aebar).

Download the pre-build script from the [Release page](https://github.com/azhimaworks/matchnull/releases).

## Building from Source

Follow these steps to get a pre-built script from the source code.

### Prerequisites

Ensure you have the following installed on your system:

- Node.js (LTS version recommended)
- [pnpm](https://pnpm.io/) (v9 or higher recommended)

Check if `pnpm` is active by running:

```bash
pnpm -v
```

_(If `pnpm` is not installed, enable it via corepack using `corepack enable pnpm`)_.

### Installation & Build Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/azhimaworks/matchnull
   cd matchnull
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Build the project:**

   ```bash
   pnpm build
   ```

Your pre-built script should already be in the dist folder
