#! /usr/bin/env node

const { program } = require('commander')



program
	.command('create-html')
	.description('creates an html file from the txt file provided')
	.action(writehtml)
