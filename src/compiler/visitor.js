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
        let visibility = node.variables[0].visibility;
        if ( visibility === 'private') {
            const privateProp = classPrivateProperty(
                PrivateName(
                    identifier('')
                )
            );
            parent._context.push(privateProp);
            node.id = privateProp.key.id ;
            node.alias = privateProp; // referernce to privateProp node which is in the Js AST
        }
        else {
            // ONLY support Identifier at the moment
            const prop = classProperty(
                identifier('')
            );
            parent._context.push(prop);
            node.alias = prop;
            node.id = prop.key;
            
        }

    },
    VariableDeclaration: function (node, parent) {

        parent.id.name = node.name;
        node.alias = parent.alias

    },
    NumberLiteral: function (node, parent) {
        let number = parseInt(node.number);
        console.log(parent)
        parent.alias.value = numericLiteral(number)
    },
    // StringLiteral: function (node, parent) {
    //     // console.log(node.value)
    //     // console.log(parent.alias)
    //     // console.log('end')
    //     parent.alias.value = stringLiteral(node.value)
    // },

}   
/**
Tasks:
+ Struct - user defined type name
+ At the moment, every variable doesn't have a TYPE 
+ Need a new approach, the current one is suck; Need to rewrite Visit function
 */