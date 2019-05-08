import {
    identifier, blockStatement,
    ifStatement, newExpression, throwStatement, functionDeclaration, decorator
} from "@babel/types";
/**
 * 
 * @param {name of decorator} decoratorName 
 */
export function generateDecorator(decoratorName) {
    return decorator(identifier(decoratorName))
}

export function generateRequireFunction() {
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
    return functionDeclaration(
        identifier('require'),
        [identifier('condition'), identifier('errorMessage')],
        body
    )
}