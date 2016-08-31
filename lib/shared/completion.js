/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const fs = require('fs')
const path = require('path')

module.exports = function(name) {
  if (typeof name !== 'string') {
    throw new Error('Missing completion type')
  }
  const file = path.join(__dirname, '../../completion', name)
  try {
    console.log(fs.readFileSync(file, 'utf8'))
    process.exit(0)
  }
  catch (err) {
    console.log(
      'echo "trailmap autocompletion rules for',
      '\'' + name + '\'',
      'not found"'
    )
    process.exit(5)
  }
}
