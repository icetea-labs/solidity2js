import parser from 'solidity-parser-antlr';
import generate from '@babel/generator';
import * as t from "@babel/types";
import prettier from "prettier/standalone";
import transformer from './transformer';

const prettierOptions = {
    parser: "babel",
    plugins: [require("prettier/parser-babylon")]
};

export function compile(soliditySrc) {
    try {

        const solidityAst = parser.parse(soliditySrc);
        console.log(solidityAst);

        const JsAst = transformer(solidityAst);
        console.log(JsAst)

        const jsSrc = generate(JsAst).code;
        return jsSrc;
        // const formattedSrc =  prettier.format(jsSrc, prettierOptions)
        // return formattedSrc;


    } catch (e) {
        return String(e);
    }
}

