/* eslint no-console: [0, { allow: ["log","warn", "error"] }] */

'use strict'

const fs = require('fs')
const path = require('path')
const log = require('./lib/trailmaplog')
const chalk = require('chalk')
const yargs = require('yargs')
const Liftoff = require('liftoff')
const tildify = require('tildify')
const interpret = require('interpret')
const v8flags = require('v8flags')
const merge = require('lodash.merge')
const isString = require('lodash.isstring')
const findRange = require('semver-greatest-satisfied-range')
const exit = require('./lib/shared/exit')
const cliOptions = require('./lib/shared/cliOptions')
const completion = require('./lib/shared/completion')
const verifyDeps = require('./lib/shared/verifyDependencies')
const cliVersion = require('./package.json').version
const getBlacklist = require('./lib/shared/getBlacklist')
const toConsole = require('./lib/shared/log/toConsole')

// Logging functions
const logVerify = require('./lib/shared/log/verify')
const logBlacklistError = require('./lib/shared/log/blacklistError')

// Get supported ranges
const ranges = fs.readdirSync(__dirname + '/lib/versioned/')

// Set env const for ORIGINAL cwd
// before anything touches it
process.env.INIT_CWD = process.cwd()

const cli = new Liftoff({
  name: 'trailmap',
  completions: completion,
  extensions: interpret.jsVariants,
  v8flags: v8flags,
  configFiles: {
    '.trailmap': {
      home: {
        path: '~',
        extensions: interpret.extensions
      },
      cwd: {
        path: '.',
        extensions: interpret.extensions
      }
    }
  }
})

const usage =
  '\n' + chalk.bold('Usage:') +
  ' trailmap ' + chalk.blue('[options]') + ' tasks'

const parser = yargs.usage(usage, cliOptions)
const opts = parser.argv

// This translates the --continue flag in trailmap
// To the settle env constiable for undertaker
// We use the process.env so the user's trailmapfile
// Can know about the flag
if (opts.continue) {
  process.env.UNDERTAKER_SETTLE = 'true'
}

// Set up event listeners for logging.
toConsole(log, opts)

cli.on('require', function(name) {
  log.info('Requiring external module', chalk.magenta(name))
})

cli.on('requireFail', function(name) {
  log.error(chalk.red('Failed to load external module'), chalk.magenta(name))
})

cli.on('respawn', function(flags, child) {
  const nodeFlags = chalk.magenta(flags.join(', '))
  const pid = chalk.magenta(child.pid)
  log.info('Node flags detected:', nodeFlags)
  log.info('Respawned to PID:', pid)
})

function run() {
  cli.launch({
    cwd: opts.cwd,
    configPath: opts.trailmapfile,
    require: opts.require,
    completion: opts.completion
  }, handleArguments)
}

module.exports = run

// The actual logic
function handleArguments(env) {

  // Map an array of keys to preserve order
  const configFilePaths = ['home', 'cwd'].map(function(key) {
    return env.configFiles['.trailmap'][key]
  })
  configFilePaths.filter(isString).forEach(function(filePath) {
    merge(opts, require(filePath))
  })

  if (opts.help) {
    console.log(parser.help())
    exit(0)
  }

  if (opts.version) {
    log.info('CLI version', cliVersion)
    if (env.modulePackage && typeof env.modulePackage.version !== 'undefined') {
      log.info('Local version', env.modulePackage.version)
    }
    exit(0)
  }

  if (opts.verify) {
    let pkgPath = opts.verify !== true ? opts.verify : 'package.json'
    if (path.resolve(pkgPath) !== path.normalize(pkgPath)) {
      pkgPath = path.join(env.cwd, pkgPath)
    }
    log.info('Verifying plugins in ' + pkgPath)
    return getBlacklist(function(err, blacklist) {
      if (err) {
        return logBlacklistError(err)
      }

      const blacklisted = verifyDeps(require(pkgPath), blacklist)

      logVerify(blacklisted)
    })
  }

  if (!env.modulePath) {
    log.error(
      chalk.red('Local trailmap not found in'),
      chalk.magenta(tildify(env.cwd))
    )
    log.error(chalk.red('Try running: npm install trailmap'))
    exit(1)
  }

  if (!env.configPath) {
    log.error(chalk.red('No .trailmap found'))
    exit(1)
  }

  // Chdir before requiring trailmapfile to make sure
  // we let them chdir as needed
  if (process.cwd() !== env.cwd) {
    process.chdir(env.cwd)
    log.info(
      'Working directory changed to',
      chalk.magenta(tildify(env.cwd))
    )
  }

  // Find the correct CLI version to run
  const range = findRange(env.modulePackage.version, ranges)

  if (!range) {
    return log.error(
      chalk.red('Unsupported trailmap version', env.modulePackage.version)
    )
  }

  // Load and execute the CLI version
  require(path.join(__dirname, '/lib/versioned/', range, '/'))(opts, env)
}
