'use strict'

const chalk = require('chalk')

module.exports = {
  help: {
    alias: 'h',
    type: 'boolean',
    desc: chalk.gray(
      'Show this help.')
  },
  version: {
    alias: 'v',
    type: 'boolean',
    desc: chalk.gray(
      'Print the global and local trailmap versions.')
  },
  require: {
    type: 'string',
    requiresArg: true,
    desc: chalk.gray(
      'Will require a module before running the trailmap. ' +
      'This is useful for transpilers but also has other applications.')
  },
  trailmapfile: {
    type: 'string',
    requiresArg: true,
    desc: chalk.gray(
      'Manually set path of trailmapfile. Useful if you have multiple trailmapfiles. ' +
      'This will set the CWD to the trailmapfile directory as well.')
  },
  cwd: {
    type: 'string',
    requiresArg: true,
    desc: chalk.gray(
      'Manually set the CWD. The search for the trailmap, ' +
      'as well as the relativity of all requires will be from here.')
  },
  verify: {
    desc: chalk.gray(
      'Will verify plugins referenced in project\'s package.json against ' +
      'the plugins blacklist.')
  },
  tasks: {
    alias: 'T',
    type: 'boolean',
    desc: chalk.gray(
      'Print the task dependency tree for the loaded trailmap.')
  },
  depth: {
    type: 'number',
    requiresArg: true,
    desc: chalk.gray(
      'Specify the depth of the task dependency tree.')
  },
  'tasks-simple': {
    type: 'boolean',
    desc: chalk.gray(
      'Print a plaintext list of tasks for the loaded trailmapfile.')
  },
  'tasks-json': {
    desc: chalk.gray(
      'Print the task dependency tree, ' +
      'in JSON format, for the loaded trailmapfile.')
  },
  color: {
    type: 'boolean',
    desc: chalk.gray(
      'Will force trailmap and trailmap plugins to display colors, ' +
      'even when no color support is detected.')
  },
  'no-color': {
    type: 'boolean',
    desc: chalk.gray(
      'Will force trailmap and trailmap plugins to not display colors, ' +
      'even when color support is detected.')
  },
  silent: {
    alias: 'S',
    type: 'boolean',
    desc: chalk.gray(
      'Suppress all trailmap logging.')
  },
  continue: {
    type: 'boolean',
    desc: chalk.gray(
      'Continue execution of tasks upon failure.')
  },
  'log-level': {
    alias: 'L',
    // Type isn't needed because count acts as a boolean
    count: true,
    // Can't use `default` because it seems to be off by one
    desc: chalk.gray(
      'Set the loglevel. -L for least verbose and -LLLL for most verbose. ' +
      '-LLL is default.')
  }
}
