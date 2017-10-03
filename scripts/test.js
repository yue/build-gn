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
process.stdout.write('Zipping and unzipping GN...')
execSync('scripts/build.js out/Release', {stdio: null})
execSync('scripts/create_dist.js', {stdio: null})
extract(`out/Release/${zipname}.zip`, {dir: path.join(tmppath, 'gn')}, runTests)
process.stdout.write('ok\n')

function runTests(error) {
  if (error) {
    console.error(error)
    process.exit(1)
  }
  for (const project of fs.readdirSync('examples')) {
    runEachTest(project, path.resolve('examples', project))
  }
}

function runEachTest(project, projectPath) {
  process.stdout.write(`Generating ninja bulid for project "${project}"...`)
  const outdir = path.join(tmppath, project, 'out')
  const gn = path.join(tmppath, 'gn', 'gn')
  execSync(`${gn} gen ${outdir}`, {cwd: projectPath, stdio: null})
  process.stdout.write('ok\n')

  process.stdout.write(`Building project "${project}"...`)
  execSync(`ninja -C ${outdir}`, {stdio: null})
  process.stdout.write('ok\n')

  process.stdout.write(`Running project "${project}"...`)
  execSync(`${path.join(outdir, 'test')}`, {stdio: null})
  process.stdout.write('ok\n')
}
