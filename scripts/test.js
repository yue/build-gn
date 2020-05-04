#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {argv, version, targetCpu, targetOs, execSync} = require('./common')

const fs = require('fs')
const os = require('os')
const path = require('path')
const extract = require('./libs/extract-zip')

// Our work dir.
const zipname = `gn_${version}_${targetOs}_${targetCpu}`
const tmppath = path.join(os.tmpdir(), zipname)

// Bulid and package.
console.log('Zipping and unzipping GN...')
execSync('node scripts/build.js out/Release')
execSync('node scripts/create_dist.js')
extract(`out/Release/${zipname}.zip`, {dir: path.join(tmppath, 'gn')}, runTests)

function runTests(error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  if (targetCpu !== 'x64' && targetOs !== 'win') {
    return
  }
  for (const project of fs.readdirSync('examples')) {
    runEachTest(project, path.resolve('examples', project))
  }
}

function runEachTest(project, projectPath) {
  console.log(`Generating ninja bulid for project "${project}"...`)
  const outdir = path.resolve('out', 'Test')
  const gn = path.join(tmppath, 'gn', 'gn')
  execSync(`${gn} gen ${outdir}`, {cwd: projectPath})

  console.log(`Building project "${project}"...`)
  execSync(`ninja -C ${outdir}`)

  console.log(`Running project "${project}"...`)
  execSync(`${path.join(outdir, 'test')}`)
}
