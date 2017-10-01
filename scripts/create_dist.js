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
  'build/linux/debian_jessie_amd64-sysroot',
  'build/linux/debian_jessie_i386-sysroot',
  'build/linux/debian_jessie_arm-sysroot',
  'build/linux/debian_jessie_arm64-sysroot',
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
const files = searchFiles('build_overrides').concat(
              searchFiles('build')).concat(
              searchFiles('tools/gyp')).concat(
              searchFiles('tools/cfi'))
for (let f of files) {
  addFileToZip(gnzip, f, '.')
}
const gnname = process.platform === 'win32' ? 'gn.exe' : 'gn'
addFileToZip(gnzip, `out/Release/${gnname}`, 'out/Release', '', {
  unixPermissions: '755'
})
const zipname = `gn_${version}_${targetOs}_${targetCpu}`
gnzip.generateNodeStream({streamFiles:true, platform: process.platform})
   .pipe(fs.createWriteStream(`out/Release/${zipname}.zip`))

function addFileToZip(zip, file, base, prefix='', options={}) {
  const stat = fs.statSync(file)
  if (stat.isDirectory()) {
    const subfiles = fs.readdirSync(file)
    for (let sub of subfiles)
      addFileToZip(zip, `${file}/${sub}`, base)
  } else if (stat.isFile()) {
    const filename = path.basename(file)
    let p = path.relative(base, file)
    p = path.join(prefix, path.dirname(p), filename)
    options.binary = true
    zip.file(p, fs.readFileSync(file), options)
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
      if (p.startsWith(f))
        return list
    }
    if (stat.isFile())
      list.push(p)
    else if (stat.isDirectory())
      searchFiles(p, list)
    return list
  }, list)
}
