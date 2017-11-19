const chalk = require('chalk');

// use to wrap a command to catch and display errors
export const withErrors = (command: (...args) => Promise<void>) => {
	return async (...args: any[]) => {
		try {
			await command(...args)
		} catch (e) {
			console.log(chalk.red(e.stack));
			process.exitCode = 1;
		}
	}
}