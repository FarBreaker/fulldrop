#! /usr/bin/env node
const shell = require('shelljs')
const yargs = require('yargs')
const chalk = require('chalk')
const chalkAnimation = require('chalk-animation')

console.log(chalk.cyan('Executing release procedure please wait'))
const argv = yargs
    .command('release', 'Command to start release sequence', {
        versionToRelease:
        {
            description: 'The version to release',
            alias: 'v',
            type: "string",
            default: 'prerelease',
            choices: ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease']
        },
        commitMessage:
        {
            description: "Message to commit",
            alias: "c",
            type: "string",
            default: undefined
        }
    })
    .help().alias('help', "h").argv

if (argv._.includes('release')) {
    const anim = chalkAnimation.karaoke(`release mode is set to ` + chalk.cyan(argv.versionToRelease))
    shell.exec(` npm version ${argv.versionToRelease} --no-git-tag`)
    setTimeout(() => {
        anim.stop()
    }, 2500)
    if (argv.commitMessage) {
        shell.exec(` git add .`)
        shell.exec(` git commit -m "${argv.commitMessage}"`)
        shell.exec(` git pull --no-rebase`)
        shell.exec(` git push`)
    }
}
