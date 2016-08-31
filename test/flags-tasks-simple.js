'use strict'

const lab = exports.lab = require('lab').script()
const code = require('code')

const fs = require('fs')
const child = require('child_process')

const output = fs.readFileSync(__dirname + '/expected/flags-tasks-simple.txt', 'utf8').replace(/(\r\n|\n|\r)/gm,'\n')

lab.experiment('flag: --tasks-simple', function() {

  lab.test('prints the task list in simple format', function(done) {
    child.exec('node ' + __dirname + '/../bin/trailmap.js --tasks-simple --cwd ./test/fixtures/trailmaps', function(err, stdout) {
      code.expect(stdout).to.equal(output)
      done(err)
    })
  })

})
