'use strict'

const log = require('../../../trailmaplog')
const chalk = require('chalk')
const prettyTime = require('pretty-hrtime')
const formatError = require('../formatError')

// Wire up logging events
function logEvents(trailmapInst) {

  const loggedErrors = []

  trailmapInst.on('start', function(evt) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    const level = evt.branch ? 'debug' : 'info'
    log[level]('Starting', '\'' + chalk.cyan(evt.name) + '\'...')
  })

  trailmapInst.on('stop', function(evt) {
    const time = prettyTime(evt.duration)
    const level = evt.branch ? 'debug' : 'info'
    log[level](
      'Finished', '\'' + chalk.cyan(evt.name) + '\'',
      'after', chalk.magenta(time)
    )
  })

  trailmapInst.on('error', function(evt) {
    const msg = formatError(evt)
    const time = prettyTime(evt.duration)
    const level = evt.branch ? 'debug' : 'error'
    log[level](
      '\'' + chalk.cyan(evt.name) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    )

    // If we haven't logged this before, log it and add to list
    if (loggedErrors.indexOf(evt.error) === -1) {
      log.error(msg)
      loggedErrors.push(evt.error)
    }
  })
}

module.exports = logEvents
