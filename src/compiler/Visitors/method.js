import { classMethod, blockStatement, identifier, returnStatement, 
        expressionStatement, callExpression } from "@babel/types";
function addCallBackInModifier(node) {
    // replace `_;` statements inside modifier by `callback()`
    node.forEach((value, index) => {
        if(value.type === "ExpressionStatement" && value.expression.name === '_') {
            value.expression = callExpression(
                identifier('callback'),
                []
            )
        }
    });

}
export default {
    FunctionDefinition: function (node, parent) {
        node._context = [];
    },
    'FunctionDefinition:exit': function (node, parent) {
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
    ModifierDefinition: function (node, parent) {
        node._context = [];
    },
    'ModifierDefinition:exit': function (node, parent) {
        node._context[0].push(identifier('callback'));
        
        addCallBackInModifier(node._context[1])
        console.log(node._context[1])
        let modifierNode = classMethod(
                'method', 
                identifier(node.name),
                node._context[0],
                blockStatement(node._context[1])
            );
        parent._context.push(modifierNode);
    },
    Block: function(node, parent) {
        node._context = []
    },
    'Block:exit': function(node, parent) {
        parent._context.push(node._context)
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
    'FunctionCall': function (node, parent) {
        node._context = [];
    },
    'FunctionCall:exit': function (node, parent) {
        let args = node._context.slice(1); 
    
        parent._context.push(callExpression(
            node._context[0],
            args

        ))
    },
}