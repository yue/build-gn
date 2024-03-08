# build-gn

This is a modified version of GN that provides Chromium's build configurations
as builtin rules, which can be used to build any project.

## How to use

1. Download the zip archive from
   [Releases](https://github.com/yue/build-gn/releases) page and extrat it.
2. Add the directory to `PATH`.
3. Write to project's top level `.gn` file with `use_chromium_config = true`.
4. Run `gn gen`.

Example project files can be found under
[examples](https://github.com/yue/build-gn/tree/master/examples).

## Disclaimer

This project is not affliated with Chromium or Google, use it at your own risk.

## Build

```
node scripts/bootstrap.js
node scripts/build.js
```

## Changes to official Chromium GN configurations

* Added `use_chromium_config` and `chromium_config_dir` variables.
* Default args changed to `is_clang=false use_sysroot=false` on Linux.
* Default args changed to `use_xcode_clang=true` on macOS.
* The `DEPOT_TOOLS_WIN_TOOLCHAIN` is set to `0` by default on Windows.
* Certain very Chromium-specific configurations have been removed.
