import { classMethod, blockStatement, identifier, returnStatement, expressionStatement } from "@babel/types";
export default {
    FunctionDefinition: function (node, parent) {
        node._context = {
            params: [],
            block: []
        }
    },
    'FunctionDefinition:exit': function (node, parent) {
        // let methodNode = classMethod()
        let isConstructor = node.isConstructor;
        let methodNode;
        if(isConstructor) {
            methodNode = classMethod(
                "constructor", 
                identifier("constructor"),
                node._context.params,
                blockStatement(node._context.block)
            );
        }
        else {
            methodNode = classMethod(
                'method', 
                identifier(node.name),
                node._context.params,
                blockStatement(node._context.block)
            );
        }
        parent._context.push(methodNode)
    },
    ExpressionStatement: function(node, parent) {
        node._context = [];
    },
    'ExpressionStatement:exit': function(node, parent) {
        parent._context.block.push(expressionStatement(node._context[0]))
    },
    ReturnStatement: function (node, parent) {
        node._context = [];
    },
    'ReturnStatement:exit': function(node, parent) {
        parent._context.block.push(returnStatement(node._context[0]))
    },
    Parameter: function (node, parent) {
        parent._context.params.push(identifier(node.name));
    },
}