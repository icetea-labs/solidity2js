import {  binaryExpression,updateExpression,assignmentExpression } from "@babel/types";
export default {
    BinaryOperation: function(node, parent) {
        node._context = [];
    },
    'BinaryOperation:exit': function(node, parent) {
        switch (node.operator) {
            case '=':
                let expressionNode = assignmentExpression('=',node._context[0],node._context[1])
                parent._context.push(expressionNode);
                break;
            case '+':
                let expression = binaryExpression(
                    '+', node._context[0],node._context[1]
                )
                parent._context.push(expression);
                break;
            default:
                break; 
        }
        
    },
    UnaryOperation: function (node, parent) {
        node._context = [];
    },
    'UnaryOperation:exit': function (node, parent) {
        switch (node.operator) {
            case '++':
                parent._context.push(updateExpression('++', node._context[0]))
                break;
            case '--':
                parent._context.push(updateExpression('--', node._context[0]))
                break;
            default:
                break;
        }
    }
}