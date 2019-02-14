import { classMethod, blockStatement, identifier, returnStatement, expressionStatement } from "@babel/types";
export default {
    FunctionDefinition: function (node, parent) {
        // node._context = {
        //     params: [],
        //     block: []
        // }
        node._context = [];
    },
    'FunctionDefinition:exit': function (node, parent) {
        // let methodNode = classMethod()
        let isConstructor = node.isConstructor;
        let methodNode;
        if(isConstructor) {
            methodNode = classMethod(
                "constructor", 
                identifier("constructor"),
                node._context[0],
                blockStatement(node._context[1])
            );
        }
        else {
            methodNode = classMethod(
                'method', 
                identifier(node.name),
                node._context[0],
                blockStatement(node._context[1])
            );
        }
        parent._context.push(methodNode)
    },
    ExpressionStatement: function(node, parent) {
        node._context = [];
    },
    'ExpressionStatement:exit': function(node, parent) {
        parent._context.push(expressionStatement(node._context[0]))
    },
    ReturnStatement: function (node, parent) {
        node._context = [];
    },
    'ReturnStatement:exit': function(node, parent) {
        parent._context.push(returnStatement(node._context[0]))
    },
    ParameterList: function (node, parent) {
        node._context = []
    },
    'ParameterList:exit': function (node, parent) {
        parent._context.push(node._context)
    },
    'Parameter': function (node, parent) {
        parent._context.push(identifier(node.name));
    },
}