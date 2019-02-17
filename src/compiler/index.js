import parser from 'solidity-parser-antlr';
import generate from '@babel/generator';
import transformer from './transformer';
function formalizeSolidityAST (ast) {
  /**
  ForStatement: adding a AST node to 3 expressions of the for statement
   */
    parser.visit(ast, {
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
        return jsSrc;
        // const formattedSrc =  prettier.format(jsSrc, prettierOptions)
        // return formattedSrc;


    } catch (e) {
        return String(e);
    }
}

