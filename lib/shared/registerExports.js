'use strict'

function registerExports(gulpInst, tasks) {
  const taskNames = Object.keys(tasks)

  if (taskNames.length) {
    taskNames.forEach(register)
  }

  function register(taskName) {
    const task = tasks[taskName]

    if (typeof task !== 'function') {
      return
    }

    gulpInst.task(taskName, task)
  }
}

module.exports = registerExports
