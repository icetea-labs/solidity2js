import { classPrivateProperty , PrivateName, classProperty, 
        variableDeclaration, variableDeclarator,identifier } from "@babel/types";
export default {
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
                parent._context.push(varNode)
                break;
        
            default:
                console.log(`type ${type} is not yet supported`)
                break;
        }
    },
    VariableDeclaration: function (node, parent) {
        parent._context.name = node.name;
        node._context = parent._context
    },
}