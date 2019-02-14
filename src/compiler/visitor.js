import { identifier, classDeclaration, classBody, classProperty, 
        classPrivateProperty , PrivateName, numericLiteral, stringLiteral,
        classMethod, blockStatement, binaryExpression,updateExpression,
        assignmentExpression, expressionStatement, memberExpression, returnStatement,
        variableDeclaration, variableDeclarator} from "@babel/types";

export default {
    PragmaDirective: function(node, parent) {
        const commentNode = {
            "type": "CommentLine",
            "value": `Pragma ${node.name} version ${node.value}`,
        };
        parent.comments.push(commentNode);
        parent.innerComments.push(commentNode);
    },
    ContractDefinition: function(node, parent) {
        const classNode = classDeclaration (
            identifier(node.name),
            undefined,
            classBody([])
        )
        node._context = classNode.body.body	;
        parent._context.push(classNode)
    },
    StateVariableDeclaration: function (node, parent) {
        node._context = [];
    },
    'StateVariableDeclaration:exit': function (node, parent) {
        let visibility = node.variables[0].visibility;
        if ( visibility === 'private') {
            const privateProp = classPrivateProperty(
                PrivateName(
                    identifier(node._context.name)
                ),
                node._context[0]
            );
            parent._context.push(privateProp);
        }
        else {
            // ONLY support Identifier at the moment
            const prop = classProperty(
                identifier(node._context.name),
                node._context[0]
            );
            parent._context.push(prop);
        }
    },
    VariableDeclarationStatement: function (node, parent) {
        node._context = [];
    },
    'VariableDeclarationStatement:exit': function (node, parent) {
        
        let type = node._context.type;
        switch (type) {
            case 'ElementaryTypeName':
                let varNode = variableDeclaration(
                    'var', 
                    [variableDeclarator(
                        identifier(node._context.name) , 
                        node._context[0]
                    )]
                )
                parent._context.block.push(varNode)
                break;
        
            default:
                break;
        }
        

    },
    VariableDeclaration: function (node, parent) {
        parent._context.name = node.name;
        node._context = parent._context
    },
    UserDefinedTypeName: function (node, parent) {
        parent._context.type = node.namePath;
    },
    ElementaryTypeName: function (node, parent) {
        parent._context.type = node.type;
    },
    NumberLiteral: function (node, parent) {
        let number = parseInt(node.number);
        parent._context.push(numericLiteral(number))
    },
    StringLiteral: function (node, parent) {
        let string = node.value;
        parent._context.push(stringLiteral(string))
    },
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
    Parameter: function (node, parent) {
        parent._context.params.push(identifier(node.name));
    },
    ExpressionStatement: function(node, parent) {
        node._context = [];
    },
    'ExpressionStatement:exit': function(node, parent) {
        parent._context.block.push(expressionStatement(node._context[0]))
    },
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
    Identifier: function (node, parent) {
        parent._context.push(identifier(node.name))
    },
    MemberAccess: function (node, parent) {
        node._context = [];
    },
    'MemberAccess:exit': function (node, parent) {
        parent._context.push(memberExpression(
            node._context[0],
            identifier(node.memberName)
        ))
    },
    ReturnStatement: function (node, parent) {
        node._context = [];
    },
    'ReturnStatement:exit': function(node, parent) {
        parent._context.block.push(returnStatement(node._context[0]))
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






/**
Tasks:
+ Struct - user defined type name
+ At the moment, every variable doesn't have a TYPE 
 */