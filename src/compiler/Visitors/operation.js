import {  binaryExpression, updateExpression, assignmentExpression, 
        logicalExpression, unaryExpression } from "@babel/types";
export default {
    BinaryOperation: function(node, parent) {
        node._context = [];
    },
    'BinaryOperation:exit': function(node, parent) {
    /**
    operators are not supported yet: 
        '|=',
        '^=',
        '<<=',
        '>>=',
    */
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
        console.log(`'${operator}' operator is not supported yet!`)
    },
    UnaryOperation: function (node, parent) {
        node._context = [];
    },
    'UnaryOperation:exit': function (node, parent) {
        /**
        operators are not supported yet: 
            'after', 'delete'
        */
        let prefix = node.isPrefix;
        let operator = node.operator;
        let supportedOps = ['+', '-', '!', '~','++', '--']; 
        if(operator === '++' || operator === '--') {
            parent._context.push(updateExpression(operator, node._context[0], prefix))
        }
        else if(supportedOps.includes(operator)) {
            parent._context.push(unaryExpression(operator, node._context[0]))
        }
        else {
            console.log(`'${operator}' operator is not supported yet!`)
        }
    }
}
