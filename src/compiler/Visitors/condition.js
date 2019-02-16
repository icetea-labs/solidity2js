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
    ForStatement: function (node, parent) {
        node._context = [];
    },

    'ForStatement:exit': function (node, parent) {
        /**
        <DONE>
        Status: Only support fully For Statement (include all 3 expressions) at the moment
        Approach: Can change the solidity tree before generating new JS tree. In this case, insert a node before each node
        contains expressions to hold it. Why, because some of these expressions can be missing!
        <DONE>
        <-------------------------->
        Problem of solidity-parser-antlr: When initExpressions and conditionExpression are missing, it treats loopExpression 
        as condititonExpression and loopExpression is null
         */
        //Hard Code!
        console.log(node._context)
        if(node._context[0].type === 'ExpressionStatement')
            node._context[0] = node._context[0].expression;
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
