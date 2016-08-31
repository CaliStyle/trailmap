'use strict'

const isString = require('lodash.isstring')
const isObject = require('lodash.isplainobject')
const isFunction = require('lodash.isfunction')

function getTask(trailmapInst) {
  return function(name) {
    const task = trailmapInst.task(name)
    return {
      description: getDescription(task),
      flags: getFlags(task)
    }
  }
}

function getDescription(task) {
  if (isString(task.description)) {
    return task.description
  }
  if (isFunction(task.unwrap)) {
    const origFn = task.unwrap()
    if (isString(origFn.description)) {
      return origFn.description
    }
  }
  return undefined
}

function getFlags(task) {
  if (isObject(task.flags)) {
    return task.flags
  }
  if (isFunction(task.unwrap)) {
    const origFn = task.unwrap()
    if (isObject(origFn.flags)) {
      return origFn.flags
    }
  }
  return undefined
}

module.exports = getTask
