import {
    classDeclaration, classBody, identifier
} from "@babel/types";
import {generateDecorator} from './util';

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
    PragmaDirective: function (node, parent) {
        const commentNode = {
            "type": "CommentLine",
            "value": `Pragma ${node.name} version ${node.value}`,

        };
        parent.comments.push(commentNode);
        parent.innerComments.push(commentNode);
    }
}