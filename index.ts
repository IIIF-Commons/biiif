#!/usr/bin/env node
const program = require('commander');
import { withErrors } from './withErrors';

program.arguments('<dir>')
	.option('-u, --url <url>', 'The url to use as the base of all ids')
	.action(withErrors(myCommand))
	.parse(process.argv);

async function myCommand(env, options) { 

	// validate inputs
	if (!program.url) {
		throw new Error('You must pass a url parameter');
	}
	

}