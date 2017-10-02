# build-gn

This is a minimal bootstrap environment for building GN, you can also use it
as a full functional environment for building any project using the `base`
library.

This repo is forked from [yue/yue](https://github.com/yue/yue) with all Yue
related history stripped.

## Goal

The goal of this project is to provide a standalone version of GN with preset
Chromium build configurations, which can be used to setup projects without
requiring fundamental build files to exist inside the projects.

Changes to GN can be found at [yue/gn](https://github.com/yue/gn).

## Disclaimer

This project is not affliated with Chromium or Google, use it at your own risk.

## Build

```
node scripts/bootstrap.js
node scripts/build.js
```

## Changes to official Chromium GN configurations

* We stay at a relative old version where libc++ is not required on Linux.
* Default args changed to `is_clang=false use_sysroot=false` on Linux.
* Default args changed to `use_xcode_clang=true` on macOS.
* The `DEPOT_TOOLS_WIN_TOOLCHAIN` is set to `0` by default on Windows.
* Certain very Chromium-specific configurations have been removed.
