#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {targetCpu, targetOs, execSync, spawnSync} = require('./common')

// Get the arch of sysroot.
let sysrootArch = {
  x64: 'amd64',
  x86: 'i386',
  arm: 'arm',
  arm64: 'arm64',
}[targetCpu]

if (process.platform !== 'win32') {
  execSync('python tools/clang/scripts/update.py')
}
if (process.platform === 'linux') {
  // TODO(zcbenz): Support more arch.
  execSync(`python build/linux/sysroot_scripts/install-sysroot.py --arch ${sysrootArch}`)
  execSync('node scripts/update_gold.js')
}

execSync('git submodule sync --recursive')
execSync('git submodule update --init --recursive')

const commonConfig = [
  'use_allocator_shim=false',
  `target_cpu="${targetCpu}"`,
]
const debugConfig = [
  'is_component_build=true',
  'is_debug=true',
  'use_sysroot=false',
  'fatal_linker_warnings=false',
]
const releaseConfig = [
  'is_component_build=false',
  'is_debug=false',
  'use_sysroot=true',
  'is_official_build=true',
  'allow_posix_link_time_opt=false',
]

if (targetOs == 'linux') {
  // This flag caused weird compilation errors when building on Linux.
  debugConfig.push('enable_iterator_debugging=false')
  // Use prebuilt clang binaries.
  commonConfig.push('is_clang=true')
}
if (targetOs == 'mac') {
  // Use prebuilt clang binaries.
  commonConfig.push('use_xcode_clang=false')
}

gen('out/Debug', debugConfig)
gen('out/Release', releaseConfig)

function gen(dir, args) {
  spawnSync('gn', ['gen', dir, `--args=${commonConfig.concat(args).join(' ')}`])
}
