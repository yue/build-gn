#!/usr/bin/env node

// Copyright 2016 Cheng Zhao. All rights reserved.
// Use of this source code is governed by the license that can be found in the
// LICENSE file.

const https = require('https')
const fs    = require('fs')
const path  = require('path')

const sha1 = {
  linux64: '15cc6942069e0463e11752fcdf2244dbeec78a43',
  mac: 'f04ec3c6cffc5cf85275b498cbd02e4777b4c518',
  win: 'a556e2e8f277452c5c54e3136e4ef123625006b5',
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
