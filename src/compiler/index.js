import parser from 'solidity-parser-antlr';
import generate from '@babel/generator';
import transformer from './transformer';

export function compile(soliditySrc) {
    try {

        const solidityAst = parser.parse(soliditySrc);


        const JsAst = transformer(solidityAst);


        const jsSrc = generate(JsAst).code;
        return jsSrc;
        // const formattedSrc =  prettier.format(jsSrc, prettierOptions)
        // return formattedSrc;


    } catch (e) {
        return String(e);
    }
}

