import { identifier, classDeclaration, classBody, classProperty, 
        classPrivateProperty , PrivateName, numericLiteral, stringLiteral,
        classMethod, blockStatement,
        assignmentExpression, expressionStatement, memberExpression} from "@babel/types";

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
    VariableDeclaration: function (node, parent) {
        parent._context.name = node.name;
        node._context = parent._context
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
        node._context = {}
    },
    'ExpressionStatement:exit': function(node, parent) {
        parent._context.block.push(node._context)
    },
    BinaryOperation: function(node, parent) {
        node._context = [];
    },
    'BinaryOperation:exit': function(node, parent) {
        switch (node.operator) {
            case '=':
                parent._context = expressionStatement(
                    assignmentExpression('=',node._context[0],node._context[1])
                )
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


}   
/**
Tasks:
+ Struct - user defined type name
+ At the moment, every variable doesn't have a TYPE 
 */