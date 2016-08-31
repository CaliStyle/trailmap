'use strict'

const trailmap = require('../../../')

function noop(cb) {
  return cb()
}
function described() {}
function errorFunction() {
  throw new Error('Error!')
}
function anon(cb) {
  return cb()
}
described.description = 'description'

trailmap.task('test1', trailmap.series(noop))
trailmap.task('test2', trailmap.series('test1', noop))
trailmap.task('test3', trailmap.series(described))
trailmap.task('test4', trailmap.series(errorFunction, anon))

trailmap.task('default', trailmap.series('test1', 'test3', noop))
