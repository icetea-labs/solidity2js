import {  ifStatement, whileStatement, doWhileStatement, forStatement, blockStatement } from "@babel/types";

export default {
    IfStatement: function (node, parent) {
        node._context = [];
    },
    'IfStatement:exit': function (node, parent) {
        parent._context.push(
            ifStatement(
                node._context[0],
                blockStatement(node._context[1]),
                node._context[2] === undefined? null : blockStatement(node._context[2])
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
    ForStatement: function (node, parent) {
        node._context = [];
    },

    'ForStatement:exit': function (node, parent) {
        parent._context.push(
            forStatement(
                node._context[0],
                node._context[1],
                node._context[2],
                blockStatement(node._context[3]),
            )
        )
    },
    initExpressionNode: function (node, parent) {
        node._context = []
    },
    'initExpressionNode:exit': function (node, parent) {
        if(node._context[0] && node._context[0].type === 'ExpressionStatement')
            node._context[0] = node._context[0].expression;
        parent._context.push(node._context[0])
    },
    conditionExpressionNode: function (node, parent) {
        node._context = []
    },
    'conditionExpressionNode:exit': function (node, parent) {
        parent._context.push(node._context[0])
    },
    loopExpressionNode: function (node, parent) {
        node._context = []
    },
    'loopExpressionNode:exit': function (node, parent) {
        parent._context.push(node._context[0])
    },


    
}
