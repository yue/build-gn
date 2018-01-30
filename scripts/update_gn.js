#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const https = require('https')
const fs    = require('fs')
const path  = require('path')

const sha1 = {
  linux64: '4e5f9299c4ae4d80dcd87b4ade0bbada23ccf866',
  mac: 'fbba40a0900ae685f5822d03d160a413d549e056',
  win: 'c0d03f78af494365ff38c663297a20fe61da29ea',
}

const platform = {
  linux: 'linux64',
  darwin: 'mac',
  win32: 'win',
}[process.platform]

const buildtools = path.resolve(__dirname, '..', 'buildtools')
const filename = platform === 'win' ? 'gn.exe' : 'gn'
const gnPath = path.join(buildtools, platform, filename)

if (!fs.existsSync(gnPath)) {
  downloadGn(sha1[platform], gnPath)
}

function downloadGn(sha1, target) {
  const url = `https://storage.googleapis.com/chromium-gn/${sha1}`
  const file = fs.createWriteStream(target)
  file.on('finish', () => fs.chmodSync(target, 0755))
  https.get(url, (response) => response.pipe(file))
}
