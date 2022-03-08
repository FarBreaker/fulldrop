#! /usr/bin/env node
const shell = require('shelljs')
const yargs = require('yargs')
const chalk = require('chalk')

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
        },
        branch:
        {
            description: "Branch to release",
            alias: "b",
            type: "string",
            default: undefined
        }

    })
    .help().alias('help', "h").argv

if (argv._.includes('release')) {
    console.log(`release mode is set to ` + chalk.greenBright(argv.versionToRelease))
    shell.exec(` npm version ${argv.versionToRelease} --no-git-tag`)
    if (argv.commitMessage) {
        console.log(`${argv.commitMessage} -->` + chalk.green(' Rolling Git operation'))
        if (argv.branch) {
            shell.exec('git stash')
            shell.exec(`git checkout ${argv.branch}`)
            shell.exec('git stash pop')
        }
        shell.exec(` git add .`)
        shell.exec(` git commit -m "${argv.commitMessage}"`)
        shell.exec(` git pull --no-rebase`)
        shell.exec(` git push`)
    } else {
        console.log(`No commit message -->` + chalk.yellow(` Skipping Git operation`))
    }
}
