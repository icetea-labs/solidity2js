import { classPrivateProperty, PrivateName, classProperty, 
        variableDeclaration, variableDeclarator, identifier, 
        arrayExpression, newExpression } from "@babel/types";
import {generateDecorator} from './util';

/**
 * array holds all the state variables to generate `this pointer` when referencing to state variables in class method.
 * feature the future.
 * for now, end-user manually add `this pointer` themselves.
 */
let stateVariables = [];

export default {
    StateVariableDeclaration: function (node, parent) {
        node._context = [];
        let decorator = generateDecorator('state');
        parent._context.push(decorator);
    },
    'StateVariableDeclaration:exit': function (node, parent) {
        let visibility = node.variables[0].visibility;
        let isAnArray = node.variables[0].typeName.type === 'ArrayTypeName'? true:false;
        let value = node._context[0];
        let variableName = node._context.name;
        stateVariables.push(variableName);
        if(!value && isAnArray) {
            value = arrayExpression([]);
        }
            
        if ( visibility === 'private') {
            const privateProp = classPrivateProperty(
                PrivateName(
                    identifier(variableName)
                ),
                value
            );
            parent._context.push(privateProp);
        }
        else {
            const prop = classProperty(
                identifier(variableName),
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
        let variableName = node._context.name;
        switch (type) {
            case 'ArrayTypeName':
                // initial array
                
                let value = node._context[0]? node._context[0]:arrayExpression([])
                let arrayNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(variableName) , 
                        value
                    )]
                )
                parent._context.push(arrayNode)
                break;
            case 'ElementaryTypeName':

                let varNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(variableName) , 
                        node._context[0]
                    )]
                )
                parent._context.push(varNode)
                break;
            case 'UserDefinedTypeName':
                let definedType = node._context.definedType;
                let newUserDefinedNode = variableDeclaration(
                    'let', 
                    [variableDeclarator(
                        identifier(variableName) , 
                        newExpression(identifier(definedType),args)
                    )]
                )
                parent._context.push(newUserDefinedNode);
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