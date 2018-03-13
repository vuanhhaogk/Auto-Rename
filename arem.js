#!/usr/bin/env node

const commander = require('commander')
const fs = require('fs')
const moment = require('moment')

commander
.option('-t, --template [template]')
.option('-s, --start [start]')
.parse(process.argv)

commander.template = commander.template || 'file-:index';
commander.start = parseInt(commander.start)
commander.start = isNaN(commander.start) ? 0 : commander.start

let temp = 'tmp-:date-:index'
let files = []

function generateFileName(template, index){
    let date = moment().format('YYYY-MM-DD')
    let nname = template
    nname = nname.replace(/\:date/gm, date)
    nname = nname.replace(/\:index/gm, index)

    return nname
}

function scan(){
    let ls = fs.readdirSync(process.cwd())

    for (let i = 0; i < ls.length; i++){
        if (ls[i] === '.' || ls[i] === '..')
            continue;

        files.push({
            name: ls[i],
            tname: generateFileName(temp, i + commander.start),
            rname: generateFileName(commander.template, i + commander.start)
        })
    }
}

function autoRename(ftype, ttype){
    for (let file of files){
        console.log(`Rename ${file[ftype]} to ${file[ttype]}`)
        fs.renameSync(`${process.cwd()}/${file[ftype]}`, file[ttype])
    }
}

scan()
autoRename('name', 'tname')
autoRename('tname', 'rname')
console.log('Done!')
