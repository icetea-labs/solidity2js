import { identifier,numericLiteral, stringLiteral, memberExpression,booleanLiteral} from "@babel/types";

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
    BooleanLiteral: function (node, parent) {
        parent._context.push(booleanLiteral(node.value));
    }
}






/**
Tasks:
+ Struct - user defined type name
 */