'use strict'

const log = require('../../../trailmaplog')
const chalk = require('chalk')

const tasks = {}

function warn() {
  const taskKeys = Object.keys(tasks)

  if (!taskKeys.length) {
    return
  }

  const taskNames = taskKeys.map(function(key) {
    return tasks[key]
  }).join(', ')

  log.warn(
    chalk.red('The following tasks did not complete:'),
    chalk.cyan(taskNames)
  )
  log.warn(
    chalk.red('Did you forget to signal async completion?')
  )
}

function start(e) {
  tasks[e.uid] = e.name
}

function clear(e) {
  delete tasks[e.uid]
}

function logSyncTask(trailmapInst) {

  process.once('exit', warn)
  trailmapInst.on('start', start)
  trailmapInst.on('stop', clear)
  trailmapInst.on('error', clear)
}

module.exports = logSyncTask
