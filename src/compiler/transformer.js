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

    const method = visitor[node.type];
    if (method)
      method(node, parent)

    traverseNode.operationsByType[node.type](node)

    const selector = node.type + ':exit';
    const exitMethod = visitor[selector];
    if (exitMethod) {
      exitMethod(node, parent)
    }
  }
  traverseNode.operationsByType = {
    SourceUnit: (node) => traverseArray(node.children, node),
    ContractDefinition: (node) => traverseArray(node.subNodes, node),
    StateVariableDeclaration: (node) => {
      traverseArray(node.variables, node);
      traverseNode(node.initialValue, node)
    },
    PragmaDirective: () => {},
    VariableDeclaration: () => {},
    NumberLiteral: () => {},
    StringLiteral: () => {},
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