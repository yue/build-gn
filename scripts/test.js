#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {argv, version, targetCpu, targetOs, execSync} = require('./common')

const os = require('os')
const path = require('path')
const extract = require('./libs/extract-zip')
const fs = require('./libs/fs-extra')

const zipname = `gn_${version}_${targetOs}_${targetCpu}`

// On Windows the tmpdir may live in a different volume from current dir, which
// will cause problems with ninja and gn, so operate in current dir instead.
const tmppath = process.platform === 'win32' ? path.resolve('tmp')
                                             : path.join(os.tmpdir(), zipname)

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
  fs.emptyDirSync(outdir)

  const gn = path.join(tmppath, 'gn', 'gn')
  execSync(`${gn} gen ${outdir}`, {cwd: projectPath})

  console.log(`Building project "${project}"...`)
  execSync(`ninja -C ${outdir}`)

  console.log(`Running project "${project}"...`)
  execSync(`${path.join(outdir, 'test')}`)
}
