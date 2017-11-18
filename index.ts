#!/usr/bin/env node
const program = require('commander');
import { withErrors } from './withErrors';
import { biiif } from './src/biiif';

program.arguments('<dir>')
	.option('-u, --url <url>', 'The url to use as the base of all ids')
	.action(withErrors(exec))
	.parse(process.argv);

async function exec(env, options) { 
	await biiif(program.dir, program.url);
	console.log("Done!");
}