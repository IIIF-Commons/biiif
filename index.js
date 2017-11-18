#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const program = require('commander');
const withErrors_1 = require("./withErrors");
program.arguments('<dir>')
    .option('-u, --url <url>', 'The url to use as the base of all ids')
    .action(withErrors_1.withErrors(myCommand))
    .parse(process.argv);
function myCommand(env, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!program.url) {
            throw new Error('You must pass a url parameter');
        }
        console.log(program.url);
        //console.log('url: %s dir: %s', program.url, dir);
    });
}
