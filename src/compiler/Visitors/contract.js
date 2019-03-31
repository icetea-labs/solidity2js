import { classDeclaration, classBody, identifier, classMethod, blockStatement, 
        ifStatement, newExpression, throwStatement} from "@babel/types";
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
    //add require function 
    'ContractDefinition:exit': function (node, parent) {
        var body = blockStatement([
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
        var requireMethodNode = classMethod(
                'method', 
                identifier('require'),
                [identifier('condition'),identifier('errorMessage')],
                body
        );
        node._context.push(requireMethodNode);
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