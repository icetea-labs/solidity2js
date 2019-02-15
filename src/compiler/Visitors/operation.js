/**
operators are not supported yet: 
    '|=',
    '^=',
    '<<=',
    '>>=',
 */
import {  binaryExpression,updateExpression,assignmentExpression, logicalExpression } from "@babel/types";
export default {
    BinaryOperation: function(node, parent) {
        node._context = [];
    },
    'BinaryOperation:exit': function(node, parent) {
        let operator = node.operator;
        let assignmentOps = [
            '+=',
            '-=',
            '*=',
            '/=',
            '%=',
            '='
        ]
        let simpleOps = [
            '+',
            '-',
            '*',
            '/',
            '**',
            '%',
            '<<',
            '>>',
            '&',
            '|',
            '^',
            '<',
            '>',
            '<=',
            '>=',
            '==',
            '!=',
        ]
        let logicalOps = [
            '&&',
            '||',
        ]
        if(assignmentOps.includes(operator)) {
            let expressionNode = assignmentExpression(operator,node._context[0],node._context[1])
            parent._context.push(expressionNode);
            return;
        }
        if(simpleOps.includes(operator)) {
            let expression = binaryExpression(
                operator, node._context[0],node._context[1]
            )
            parent._context.push(expression);
            return;
        }
        if(logicalOps.includes(operator)) {
            let expression = logicalExpression(
                operator, node._context[0],node._context[1]
            )
            parent._context.push(expression);
            return;
        }
    },
    UnaryOperation: function (node, parent) {
        node._context = [];
    },
    'UnaryOperation:exit': function (node, parent) {
        var prefix = node.isPrefix;
        switch (node.operator) {
            case '++':
                parent._context.push(updateExpression('++', node._context[0], prefix))
                break;
            case '--':
                parent._context.push(updateExpression('--', node._context[0], prefix))
                break;
            default:
                break;
        }
    }
}
