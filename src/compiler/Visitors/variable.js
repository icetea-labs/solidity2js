import { classPrivateProperty , PrivateName, classProperty, 
        variableDeclaration, variableDeclarator, identifier, 
        arrayExpression, newExpression } from "@babel/types";
import {generateDecorator} from './util';

export default {
    StateVariableDeclaration: function (node, parent) {
        node._context = [];
        let decorator = generateDecorator('state')
        parent._context.push(decorator)
    },
    'StateVariableDeclaration:exit': function (node, parent) {
        //add decorator @state
        let visibility = node.variables[0].visibility;
        let isAnArray = node.variables[0].typeName.type;
        let value = node._context[0];
        if(!value && isAnArray)
            value = arrayExpression([])
        if ( visibility === 'private') {
            const privateProp = classPrivateProperty(
                PrivateName(
                    identifier(node._context.name)
                ),
                value
            );
            parent._context.push(privateProp);
        }
        else {
            // ONLY support Identifier at the moment
            const prop = classProperty(
                identifier(node._context.name),
                value
            );
            parent._context.push(prop);
        }
    },
    VariableDeclarationStatement: function (node, parent) {
        node._context = [];
    },
    'VariableDeclarationStatement:exit': function (node, parent) {
        let type = node._context.type;
        let args = node._context.slice(1);
        switch (type) {
            case 'ArrayTypeName':
                // initial array
                let value = node._context[0]? node._context[0]:arrayExpression([])
                let arrayNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(node._context.name) , 
                        value
                    )]
                )
                parent._context.push(arrayNode)
                break;
            case 'ElementaryTypeName':
                let varNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(node._context.name) , 
                        node._context[0]
                    )]
                )
                parent._context.push(varNode)
                break;
            case 'UserDefinedTypeName':
                let newObjNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(node._context.name) , 
                        newExpression(identifier(node._context.definedType),args)
                    )]
                )
                parent._context.push(newObjNode);
                break;
            default:
                console.log(`type ${type} is not yet supported`)
                break;
        }
    },
    VariableDeclaration: function (node, parent) {
        /**
        FUTURE: <refactor code> moving 'variable declaration' from VariableDeclarationStatement to here.
        Obviously from this part, there is no initial value so if it does present, I will update it in the VariableDeclarationStatement
         */
        
        parent._context.name = node.name;
        node._context = parent._context
    },
}