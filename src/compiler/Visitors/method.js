import { classMethod, blockStatement, identifier, returnStatement, 
        expressionStatement, callExpression, functionDeclaration } from "@babel/types";
function addCallBack(node) {
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
        node._context.modifiers = [];
    },
    'FunctionDefinition:exit': function (node, parent) {
        let isConstructor = node.isConstructor;
        let hasModifier = node.modifiers.length !== 0 ? true:false;
        let methodNode;
        let functionParams = node._context[0];
        // wrap function's body inside a block statement. Check if it is null because block statement require an array.
        let functionBody = node._context[1] ? blockStatement(node._context[1]):blockStatement([]);
        if(hasModifier) {
            let blockBody = [];
            let nestedFunction = functionDeclaration(
                identifier('nestedFunction'),
                functionParams,
                functionBody
            )
            blockBody.push(nestedFunction);
            node._context.modifiers.forEach(element => {
                element.arguments.push(identifier('nestedFunction'))
                blockBody.push(expressionStatement(element))
            });
            functionBody = blockStatement(blockBody);
        }
        //FUTURE update: throw warning when user try to name another function or variable under the 'nestedFunction'
        if(isConstructor) {
            methodNode = classMethod(
                "constructor", 
                identifier("constructor"),
                functionParams,
                functionBody
            );
        }
        else {
            methodNode = classMethod(
                'method', 
                identifier(node.name),
                functionParams,
                functionBody
            );
        }
        const commentNode = {
            "type": "CommentLine",
            "value": `Pragma  version `,
        };
        methodNode.innerComments = []
        methodNode.innerComments.push(commentNode);
        parent._context.push(methodNode)
        

        
    },
    ModifierDefinition: function (node, parent) {
        node._context = [];
    },
    'ModifierDefinition:exit': function (node, parent) {
        node._context[0].push(identifier('callback'));
        addCallBack(node._context[1])
        let modifierNode = classMethod(
                'method', 
                identifier(node.name),
                node._context[0],
                blockStatement(node._context[1])
            );
        parent._context.push(modifierNode);
    },
    ModifierInvocation: function (node, parent) {
        node._context = [];
    },
    'ModifierInvocation:exit': function (node, parent) {
        parent._context.modifiers.push(callExpression(
            identifier(node.name),
            node._context
        ))
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
        if(node._context[0]) {
            parent._context.push(expressionStatement(node._context[0]))
        }
        
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