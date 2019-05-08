import {
    classDeclaration, classBody, identifier, classMethod, blockStatement,
    ifStatement, newExpression, throwStatement, functionDeclaration
} from "@babel/types";
import {generateDecorator, generateRequireFunction} from './util';

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
        let decorator = generateDecorator('contract');
        parent._context.push(decorator);
        
        parent._context.push(classNode);
       
    },
    
    /**
     * 
     * By default, adding function require() to contract.
     */

    'PragmaDirective:exit': function (node, parent) {
        let requireFunction = generateRequireFunction();
        parent._context.push(requireFunction);
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