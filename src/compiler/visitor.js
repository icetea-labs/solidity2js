import { variableDeclarator, variableDeclaration, identifier, classDeclaration, classBody, classProperty, 
        classPrivateProperty , PrivateName} from "@babel/types";

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
        console.log(classNode)
        node._context = classNode.body.body	;
        parent._context.push(classNode)
    },
    StateVariableDeclaration: function (node, parent) {
        let visibility = node.variables[0].visibility;
        if ( visibility === 'private') {
            let privateProp = classPrivateProperty(
                PrivateName(
                    identifier('')
                )
            );
            parent._context.push(privateProp);
            node.value = privateProp.value;
            node.name = privateProp.key.id.name;
        }
        else {
            // ONLY support Identifier at the moment
            let prop = classProperty(
                identifier('')
            );
            parent._context.push(prop);
            node.value = prop.value;
            node.name = prop.key.name;
            
        }

    },
    // VariableDeclaration: function (node, parent) {
    //     parent.name = node.name;
    //     parent.value = 
    // }
}   
/**
Tasks:
+ Struct - user defined type name
+ At the moment, every variable doesn't have a TYPE 
 */