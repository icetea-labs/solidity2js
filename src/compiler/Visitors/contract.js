import { classDeclaration, classBody, identifier } from "@babel/types";
export default {
    //add @contract 
    ContractDefinition: function(node, parent) {
        const classNode = classDeclaration (
            identifier(node.name),
            undefined,
            classBody([])
        )
        node._context = classNode.body.body	;
        parent._context.push(classNode)
    },
    PragmaDirective: function(node, parent) {
        const commentNode = {
            "type": "CommentLine",
            "value": `Pragma ${node.name} version ${node.value}`,
        };
        parent.comments.push(commentNode);
        parent.innerComments.push(commentNode);
    }
}