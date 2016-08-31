/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

function logTasksSimple(nodes) {
  console.log(nodes.join('\n').trim())
}

module.exports = logTasksSimple
