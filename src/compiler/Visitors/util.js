import {
    identifier, decorator
} from "@babel/types";

/**
 * 
 * @param {name of decorator} decoratorName 
 */
export function addDecorator(decoratorName) {
    return decorator(identifier(decoratorName))
}