import parser from 'solidity-parser-antlr';
import generate from '@babel/generator';
import transformer from './transformer';
import prettier from 'prettier';

function formalizeSolidityAST (ast) {

    parser.visit(ast, {
        /**
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
        const JsAst = transformer(solidityAst);
        const jsSrc = generate(JsAst).code;
        console.log(prettier)
        return jsSrc;



    } catch (e) {
        return String(e);
    }
}

