#!/usr/bin/env node
const program = require('commander');
import { withErrors } from './src/WithErrors';
import { BIIIF } from './src/BIIIF';

program.arguments('<dir>')
	.option('-u, --url <url>', 'The url to use as the base of all ids')
	.action(withErrors(exec))
	.parse(process.argv);

async function exec(env, options) { 
	const dir: string = program.args[0];
	BIIIF.process(dir, program.url);
	console.log("Done!");	
}