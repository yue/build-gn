#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {argv, ccWrapper, version, targetCpu, targetOs, execSync} = require('./common')

const path = require('path')
const extract = require('./libs/extract-zip')
const fs = require('./libs/fs-extra')

const zipname = `gn_${version}_${targetOs}_${targetCpu}`

// On Windows the tmpdir may live in a different volume from current dir, which
// will cause problems with ninja and gn, so operate in current dir instead.
const tmppath = path.resolve('out', 'Assets')

main()

async function main() {
  console.log('Zipping and unzipping GN...')
  execSync('node scripts/build.js out/Release')
  execSync('node scripts/create_dist.js')
  try {
    await extract(`out/Release/${zipname}.zip`, {dir: path.join(tmppath, 'gn')})
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
  runTests()
  fs.removeSync(tmppath)
}

function runTests(error) {
  const projects = process.argv.length > 2 ? process.argv.slice(2)
                                           : fs.readdirSync('examples')
  for (const project of projects) {
    runEachTest(project, path.resolve('examples', project))
  }
}

function runEachTest(project, projectPath) {
  console.log(`Generating ninja bulid for project "${project}"...`)
  const outdir = path.resolve('out', 'Test')
  fs.emptyDirSync(outdir)

  if (projectPath.endsWith('libcxx')) {
    execSync(`python3 ${path.join(tmppath, 'gn/tools/clang/scripts/update.py')}`)
  }

  const args = ccWrapper ? `--args="cc_wrapper=\\"${ccWrapper}\\""` : ''
  const gn = path.join(tmppath, 'gn', 'gn')
  execSync(`${gn} gen ${outdir} ${args}`, {cwd: projectPath})

  console.log(`Building project "${project}"...`)
  execSync(`ninja -C ${outdir}`)

  console.log(`Running project "${project}"...`)
  execSync(`${path.join(outdir, 'test')}`)
}
