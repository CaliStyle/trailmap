'use strict'

const archy = require('archy')
const chalk = require('chalk')
const log = require('../../trailmaplog')

const sortBy = require('lodash.sortby')
const isString = require('lodash.isstring')
const isObject = require('lodash.isplainobject')

function logTasks(tree, depth, getTask) {
  depth = (typeof depth !== 'number') ? null : ((depth < 1) ? 1 : depth)

  const lineInfos = []
  const entryObserver = getLineInfoCollector(lineInfos)

  tree = copyTree(tree, depth, getTask, entryObserver)

  const spacer = getSpacerForLineIndents(tree, lineInfos)
  const lines = getLinesContainingOnlyBranches(tree)

  log.info(tree.label)
  printTreeList(lines, spacer, lineInfos)
}

function getLineInfoCollector(lineInfos) {
  return {
    topTask: function(node) {
      lineInfos.push({
        name: node.label,
        desc: node.desc,
        type: 'top'
      })
    },
    option: function(opt) {
      lineInfos.push({
        name: opt.label,
        desc: opt.desc,
        type: 'option'
      })
    },
    childTask: function(node) {
      lineInfos.push({
        name: node.label,
        type: 'child'
      })
    }
  }
}

function copyTree(tree, depth, getTask, entryObserver) {
  const newTree = {
    label: tree.label,
    nodes: []
  }

  sortBy(tree.nodes, sorter).forEach(visit)

  function sorter(node) {
    return node.label
  }

  function visit(node) {
    const task = getTask(node.label) || {}

    const newNode = {
      label: node.label,
      desc: isString(task.description) ? task.description : '',
      opts: [],
      nodes: []
    }
    entryObserver.topTask(newNode)
    newTree.nodes.push(newNode)

    if (isObject(task.flags)) {
      Object.keys(task.flags).sort().forEach(function(flag) {
        if (flag.length === 0) {
          return
        }
        const opt = {
          label: flag,
          desc: isString(task.flags[flag]) ? task.flags[flag] : ''
        }
        entryObserver.option(opt)
        newNode.opts.push(opt)
        newNode.label += '\n' + opt.label // The way of archy for options.
      })
    }

    if (!depth || depth > 1) {
      const fn = function(child, maxDepth, nowDepth, newParent) {
        const newChild = {
          label: child.label,
          nodes: []
        }
        entryObserver.childTask(newChild)
        newChild.label = '' // Because don't use child tasks to calc indents.
        newParent.nodes.push(newChild)
        if (!maxDepth || maxDepth > nowDepth) {
          forEachNode(child.nodes, fn, maxDepth, nowDepth + 1, newChild)
        }
      }
      forEachNode(node.nodes, fn, depth, 2, newNode)
    }
  }

  return newTree
}

function forEachNode(nodes, fn) {
  if (!Array.isArray(nodes)) {
    return
  }

  const args = [].slice.call(arguments, 2)

  // for (let i = 0, n = nodes.length i < n i++) {
  //   fn.apply(nodes[i], [nodes[i]].concat(args))
  // }

  for (const i of nodes) {
    fn.apply(nodes[i], [nodes[i]].concat(args))
  }
}

function getSpacerForLineIndents(tree, lineInfos) {
  let maxSize = 0
  const sizes = []

  archy(tree)
    .split('\n')
    .slice(1, -1)
    .forEach(function(line, index) {
      const info = lineInfos[index]
      if (info.type === 'top' || info.type === 'option') {
        maxSize = Math.max(maxSize, line.length)
        sizes.push(line.length)
      }
      else {
        sizes.push(0)
      }
    })

  maxSize += 3

  return function(index) {
    return Array(maxSize - sizes[index]).join(' ')
  }
}

function getLinesContainingOnlyBranches(tree) {
  tree.nodes.forEach(function(node) {
    node.label = ''
    node.opts.forEach(function() {
      node.label += '\n'
    })
  })

  return archy(tree)
    .split('\n')
    .slice(1, -1)
}

function printTreeList(lines, spacer, lineInfos) {
  lines.forEach(function(branch, index) {
    const info = lineInfos[index]

    let line = chalk.white(branch)

    if (info.type === 'top') {
      line += chalk.cyan(info.name)
      if (info.desc.length > 0) {
        line += spacer(index) + chalk.white(info.desc)
      }
    }
    else if (info.type === 'option') {
      line += chalk.magenta(info.name)
      if (info.desc.length > 0) {
        line += spacer(index) + chalk.white('…' + info.desc)
      }
    }
    else { // If (info.type === 'child') {
      line += chalk.white(info.name)
    }

    log.info(line)
  })
}

module.exports = logTasks

