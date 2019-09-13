import parser from 'solidity-parser-antlr';
import generate from '@babel/generator';
import transformer from './transformer';
import prettier from "prettier/standalone";

const prettierOptions = {
    parser: "babel",
    plugins: [require("prettier/parser-babylon")]
};

function formalizeSolidityAST (ast) {

    parser.visit(ast, {
        /**
         * `PURPOSE`
        ForStatement: adding AST nodes holding 3 expressions node of the forStatement node,
        for easy transforming later.
        */
        ForStatement: function (node) {
        
            node.initExpressionNode = {
                type: 'initExpressionNode',
                expression: node.initExpression
            }
            node.conditionExpressionNode = {
                type: 'conditionExpressionNode',
                expression: node.conditionExpression
            }
            node.loopExpressionNode = {
                type: 'loopExpressionNode',
                expression: node.loopExpression
            }
        }
    })
  
}
export function compile(soliditySrc) {
    try {

        const solidityAst = parser.parse(soliditySrc);
        formalizeSolidityAST(solidityAst);
        console.log(solidityAst)
        const JsAst = transformer(solidityAst);
        console.log(JsAst)
        const jsSrc = generate(JsAst).code;
        const formattedSrc =  prettier.format(jsSrc, prettierOptions)
        return formattedSrc;

    } catch (e) {
        return String(e);
    }
}

