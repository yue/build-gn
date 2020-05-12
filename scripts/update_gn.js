#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const {streamPromise} = require('./common')

const fs = require('fs')
const path = require('path')
const fetch = require('./libs/node-fetch')
const extract = require('./libs/extract-zip')

const platform = {
  linux: 'linux64',
  darwin: 'mac',
  win32: 'win',
}[process.platform]

const buildtools = path.resolve(__dirname, '..', 'buildtools')
const targetDir = path.join(buildtools, platform)
const gnPath = path.join(targetDir, platform == 'win' ? 'gn.exe' : 'gn')

if (!fs.existsSync(gnPath)) {
  downloadGn(targetDir, gnPath)
}

async function downloadGn(targetDir, gnPath) {
  const platform = {
    linux: 'linux',
    darwin: 'mac',
    win32: 'windows',
  }[process.platform]
  const ret = await fetch(`https://chrome-infra-packages.appspot.com/dl/gn/gn/${platform}-amd64/+/latest`)
  const zipPath = path.join(targetDir, 'gn.zip')
  const file = fs.createWriteStream(zipPath)
  await streamPromise(ret.body.pipe(file))
  await extract(zipPath, {dir: targetDir})
  fs.chmodSync(gnPath, 0755)
  fs.unlinkSync(zipPath)
}
