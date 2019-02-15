import {  ifStatement, whileStatement, doWhileStatement, blockStatement } from "@babel/types";

export default {
    IfStatement: function (node, parent) {
        node._context = [];
    },
    'IfStatement:exit': function (node, parent) {
        parent._context.push(
            ifStatement(
                node._context[0],
                blockStatement(node._context[1]),
                blockStatement(node._context[2]),
            )
        )
    },
    WhileStatement: function (node, parent) {
        node._context = [];
    },
    'WhileStatement:exit': function (node, parent) {
        parent._context.push(
            whileStatement(
                node._context[0],
                blockStatement(node._context[1]),
            )
        )
    },
    DoWhileStatement: function (node, parent) {
        node._context = [];
    },
    'DoWhileStatement:exit': function (node, parent) {
        parent._context.push(
            doWhileStatement(
                node._context[0],
                blockStatement(node._context[1]),
            )
        )
    },
    
}
