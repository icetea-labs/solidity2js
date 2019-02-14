import { identifier,numericLiteral, stringLiteral, memberExpression,} from "@babel/types";

export default {
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