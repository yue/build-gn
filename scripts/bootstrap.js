#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {targetCpu, targetOs, execSync, spawnSync} = require('./common')

// Get the arch of sysroot.
let sysrootArch = {
  x64: 'amd64',
  x86: 'i386',
}[targetCpu]

execSync('node scripts/update_gn.js')
if (process.platform == 'linux') {
  execSync('python3 tools/clang/scripts/update.py')
  execSync(`python3 build/linux/sysroot_scripts/install-sysroot.py --arch ${sysrootArch}`)
}

execSync('git submodule sync --recursive')
execSync('git submodule update --init --recursive')

const commonConfig = [
  'use_jumbo_build=true',
  'use_cxx17=true',
  'treat_warnings_as_errors=false',
  `target_cpu="${targetCpu}"`,
]
const debugConfig = [
  'is_component_build=true',
  'is_debug=true',
  'fatal_linker_warnings=false',
]
const releaseConfig = [
  'is_component_build=false',
  'is_debug=false',
  'is_official_build=true',
]

if (targetOs == 'linux') {
  // Use prebuilt clang binaries.
  commonConfig.push('is_clang=true',
                    'clang_use_chrome_plugins=false')
  // Use sysroot.
  releaseConfig.push('use_sysroot=true')
  // Link with libc++ statically.
  releaseConfig.push('use_custom_libcxx=true')
  releaseConfig.push('libcxx_is_shared=false')
} else if (targetOs == 'mac') {
  commonConfig.push('mac_sdk_min="10.12"')
}

gen('out/Debug', debugConfig)
gen('out/Release', releaseConfig)

function gen(dir, args) {
  spawnSync('gn', ['gen', dir, `--args=${commonConfig.concat(args).join(' ')}`])
}
