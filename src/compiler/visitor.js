import { variableDeclarator, variableDeclaration, identifier, classDeclaration, classBody, classProperty, 
        classPrivateProperty , PrivateName, numericLiteral, stringLiteral} from "@babel/types";

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
        node._context = {};
    },
    'StateVariableDeclaration:exit': function (node, parent) {
        let visibility = node.variables[0].visibility;
        if ( visibility === 'private') {
            const privateProp = classPrivateProperty(
                PrivateName(
                    identifier(node._context.name)
                ),
                node._context.value
            );
            parent._context.push(privateProp);
        }
        else {
            // ONLY support Identifier at the moment
            const prop = classProperty(
                identifier(node._context.name),
                node._context.value
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
        parent._context.value = numericLiteral(number)  
    },
    StringLiteral: function (node, parent) {
        let string = node.value;
        parent._context.value = stringLiteral(string)
    },

}   
/**
Tasks:
+ Struct - user defined type name
+ At the moment, every variable doesn't have a TYPE 
+ Need a new approach, the current one is suck; Need to rewrite Visit function
 */