import parser from 'solidity-parser-antlr';
import jsGenerator from './jsGenerator'
const prettier = require("prettier/standalone");
const prettierBabylon = require("prettier/parser-babylon");

export function compile(src) {
    try {
    return prettier.format(jsGenerator(parser.parse(src)), {
        parser: "babylon",
        plugins: [prettierBabylon]
      });
    } catch (e) {
        return String(e);
    }
}