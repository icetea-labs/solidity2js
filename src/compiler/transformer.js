import {file, program} from "@babel/types";
import visitor from './visitor';
function _isASTNode(node) {
  return !!node && typeof node === 'object' && node.hasOwnProperty('type')
}
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent) {
    if (!_isASTNode(node)) return
    let methods = visitor[node.type];
    if (methods)
      methods(node, parent)
    
    switch (node.type) {
      case 'SourceUnit':
        traverseArray(node.children, node);
        break;
      case 'ContractDefinition':
        traverseArray(node.subNodes, node);
        break;
      case 'StateVariableDeclaration':
        traverseArray(node.variables, node);
        traverseNode(node.initialValue, node)
        break;
      case 'VariableDeclaration':
      case 'StringLiteral':
      case 'NumberLiteral':
      case 'PragmaDirective':
        break;
      default:
        console.log(node.type)
        throw new TypeError(node.type);
    }
    const selector = node.type + ':exit'
    if (visitor[selector]) {
      visitor[selector](node, parent)
    }
  }
  traverseNode(ast, null);

}
/**
transform solidity AST => javascript AST
 */
function transformer(ast) {
    let newAst = file(
      program([],undefined,'module',undefined),
      [],
    );
    ast._context = newAst.program.body;
    ast.comments = newAst.comments;
    ast.innerComments = newAst.program.innerComments = []
    // visit(ast, null, visitor);  
    traverser(ast, visitor)

    return newAst;


}
export default transformer