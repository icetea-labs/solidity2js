import { identifier, numericLiteral, stringLiteral, memberExpression,
        booleanLiteral, arrayExpression} from "@babel/types";

export default {
    UserDefinedTypeName: function (node, parent) {
        parent._context.type = node.namePath;
    },
    ElementaryTypeName: function (node, parent) {
        parent._context.type = node.type;
    },
    ArrayTypeName: function (node, parent) {
        parent._context.type = node.type;
        node._context = [];
    },
    TupleExpression: function (node, parent) {
        node._context = [];
    },
    'TupleExpression:exit': function (node, parent) {
        let isArray = node.isArray;
        if(isArray) {
            parent._context.push(arrayExpression(node._context))
        } else {
            console.log('Javascript does not support Tupple data structure!')
        }
    },
    IndexAccess: function (node, parent) {
        node._context = [];
    },
    'IndexAccess:exit': function (node, parent) {
        let base = node._context[0];
        let index = node._context[1];
        let memberExpressionNode = memberExpression(base, index, true)
        parent._context.push(memberExpressionNode);
    },
    NumberLiteral: function (node, parent) {
        let number = parseInt(node.number);
        parent._context.push(numericLiteral(number))
    },
    StringLiteral: function (node, parent) {
        let string = node.value;
        parent._context.push(stringLiteral(string))
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
    BooleanLiteral: function (node, parent) {
        parent._context.push(booleanLiteral(node.value));
    }
}






/**
Tasks:
+ Struct - user defined type name
 */