#!/usr/bin/env node

// Copyright 2017 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {version, targetCpu, targetOs, execSync} = require('./common')

const fs = require('fs')
const path = require('path')
const JSZip = require('./libs/jszip')

// Blacklist folders.
const folderBlacklist = [
  /debian_.*-sysroot/,
]

// Blacklist for file extensions.
const extensionBlacklist = [
  '.git',
  '.pyc',
]

// Clear previous distributions.
fs.readdirSync('out/Release').forEach((f) => {
  if (f.endsWith('.zip'))
    fs.unlinkSync(`out/Release/${f}`)
})

// Zip the gn binary and build configurations.
const gnzip = new JSZip()
const files =
  searchFiles('build_overrides').concat(
  searchFiles('build')).concat(
  searchFiles('buildtools/third_party/libc++/trunk/src')).concat(
  searchFiles('buildtools/third_party/libc++/trunk/include')).concat(
  searchFiles('buildtools/third_party/libc++abi/trunk/src')).concat(
  searchFiles('buildtools/third_party/libc++abi/trunk/include')).concat(
  searchFiles('buildtools/third_party/libunwind/trunk/src')).concat(
  searchFiles('buildtools/third_party/libunwind/trunk/include')).concat(
  searchFiles('testing')).concat(
  searchFiles('tools/cfi')).concat(
  searchFiles('tools/win')).concat(
  searchFiles('third_party/catapult')).concat(
  searchFiles('third_party/googletest'))
addFileToZip(gnzip, 'buildtools/third_party/libc++/BUILD.gn', '.')
addFileToZip(gnzip, 'buildtools/third_party/libc++abi/BUILD.gn', '.')
addFileToZip(gnzip, 'buildtools/third_party/libunwind/BUILD.gn', '.')
for (let f of files) {
  addFileToZip(gnzip, f, '.')
}

const platform = {
  linux: 'linux64',
  darwin: 'mac',
  win32: 'win',
}[process.platform]
const ninjaname = process.platform === 'win32' ? 'ninja.exe' : 'ninja'
addFileToZip(gnzip, `buildtools/${platform}/${ninjaname}`, `buildtools/${platform}`)

const gnname = process.platform === 'win32' ? 'gn.exe' : 'gn'
if (process.platform === 'linux')
  strip(`out/Release/${gnname}`)
addFileToZip(gnzip, `out/Release/${gnname}`, 'out/Release')

const zipname = `gn_${version}_${targetOs}_${targetCpu}`
gnzip.generateNodeStream({streamFiles:true, platform: process.platform})
   .pipe(fs.createWriteStream(`out/Release/${zipname}.zip`))

function addFileToZip(zip, file, base) {
  const stat = fs.statSync(file)
  if (stat.isDirectory()) {
    const subfiles = fs.readdirSync(file)
    for (let sub of subfiles)
      addFileToZip(zip, `${file}/${sub}`, base)
  } else if (stat.isFile()) {
    let options = {binary: true}
    if (process.platform !== 'win32') {
      try {
        fs.accessSync(file, fs.constants.X_OK)
        options.unixPermissions = '755'
      } catch (e) {
        options.unixPermissions = '644'
      }
    }
    let rp = path.relative(base, file)
    if (process.platform === 'win32') {
      // Some unzip tools force using / as file delimiter.
      rp = rp.replace(/\\/g, '/')
    }
    zip.file(rp, fs.readFileSync(file), options)
  }
  return zip
}

function searchFiles(dir, list = []) {
  return fs.readdirSync(dir).reduce((list, filename) => {
    const p = path.join(dir, filename)
    const stat = fs.statSync(p)
    if (extensionBlacklist.includes(path.extname(p)) ||
        extensionBlacklist.includes(path.basename(p)))
      return list
    for (const f of folderBlacklist) {
      if (f.test(p))
        return list
    }
    if (stat.isFile())
      list.push(p)
    else if (stat.isDirectory())
      searchFiles(p, list)
    return list
  }, list)
}

function strip(file) {
  // TODO(zcbenz): Copy the debug symbols out before striping.
  execSync(`strip ${file}`)
}
