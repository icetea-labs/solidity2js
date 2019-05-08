import {
    classDeclaration, classBody, identifier, classMethod, blockStatement,
    ifStatement, newExpression, throwStatement
} from "@babel/types";
import {addDecorator} from './util';

export default {
    ContractDefinition: function (node, parent) {
        const classNode = classDeclaration(
            identifier(node.name),
            undefined,
            classBody([])
        )
        node._context = classNode.body.body;
        /**
         * adding 'contract' decorator: @contract
         */
        let decorator = addDecorator('contract');
        parent._context.push(decorator);
        
        parent._context.push(classNode);
       
    },
    //default adding function require() to contract
    'ContractDefinition:exit': function (node, parent) {
        let body = blockStatement([
            ifStatement(
                identifier('!condition'),
                blockStatement([
                    throwStatement(newExpression(
                        identifier('Error'),
                        [identifier('errorMessage')]
                    ))
                ]),
            )
        ]);
        let requireMethodNode = classMethod(
            'method',
            identifier('require'),
            [identifier('condition'), identifier('errorMessage')],
            body
        );
        node._context.push(requireMethodNode);
    },
    PragmaDirective: function (node, parent) {
        const commentNode = {
            "type": "CommentLine",
            "value": `Pragma ${node.name} version ${node.value}`,

        };
        parent.comments.push(commentNode);
        parent.innerComments.push(commentNode);
    }
}