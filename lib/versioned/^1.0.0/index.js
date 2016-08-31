/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const fs = require('fs')

const log = require('../../trailmaplog')
const chalk = require('chalk')
const stdout = require('mute-stdout')
const tildify = require('tildify')
const isString = require('lodash.isstring')

const exit = require('../../shared/exit')

const logTasks = require('../../shared/log/tasks')
const logEvents = require('./log/events')
const logSyncTask = require('./log/syncTask')
const logTasksSimple = require('./log/tasksSimple')
const registerExports = require('../../shared/registerExports')

const getTask = require('./log/getTask')

function execute(opts, env) {

  const tasks = opts._
  const toRun = tasks.length ? tasks : ['default']

  if (opts.tasksSimple || opts.tasks || opts.tasksJson) {
    // Mute stdout if we are listing tasks
    stdout.mute()
  }

  const trailmapInst = require(env.modulePath)
  logEvents(trailmapInst)
  logSyncTask(trailmapInst)

  // This is what actually loads up the trailmap
  const exported = require(env.configPath)

  registerExports(trailmapInst, exported)

  // Always unmute stdout after trailmap is required
  stdout.unmute()

  process.nextTick(function() {
    let tree

    if (opts.tasksSimple) {
      tree = trailmapInst.tree()
      return logTasksSimple(tree.nodes)
    }
    if (opts.tasks) {
      tree = trailmapInst.tree({ deep: true })
      if (opts.description && isString(opts.description)) {
        tree.label = opts.description
      }
      else {
        tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath))
      }

      return logTasks(tree, opts.depth, getTask(trailmapInst))
    }
    if (opts.tasksJson) {
      tree = trailmapInst.tree({ deep: true })
      if (opts.description && isString(opts.description)) {
        tree.label = opts.description
      }
      else {
        tree.label = 'Tasks for ' + tildify(env.configPath)
      }

      const output = JSON.stringify(tree)

      if (typeof opts.tasksJson === 'boolean' && opts.tasksJson) {
        return console.log(output)
      }
      return fs.writeFileSync(opts.tasksJson, output, 'utf-8')
    }
    try {
      log.info('Using trailmap', chalk.magenta(tildify(env.configPath)))
      trailmapInst.parallel(toRun)(function(err) {
        if (err) {
          exit(1)
        }
      })
    }
    catch (err) {
      log.error(chalk.red(err.message))
      log.error('To list available tasks, try running: trailmap --tasks')
      exit(1)
    }
  })
}

module.exports = execute
