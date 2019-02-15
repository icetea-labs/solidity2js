import {  ifStatement,blockStatement } from "@babel/types";

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
    Block: function(node, parent) {
        node._context = []
    },
    'Block:exit': function(node, parent) {
        parent._context.push(node._context)
    }
}
