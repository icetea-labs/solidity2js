import {file, program} from "@babel/types";
import visitor from './visitor';

function visit(node, parent, visitor) {
  if (Array.isArray(node)) {
    node.forEach(child => visit(child, parent, visitor))
  }

  if (!_isASTNode(node)) return

  let cont = true

  if (visitor[node.type]) {
    cont = visitor[node.type](node, parent)
  }

  if (cont === false) return

  for (const prop in node) {
    if (node.hasOwnProperty(prop)) {
      visit(node[prop], node, visitor)
    }
  }
  const selector = node.type + ':exit'
  if (visitor[selector]) {
    visitor[selector](node, parent)
  }
}
function _isASTNode(node) {
  return !!node && typeof node === 'object' && node.hasOwnProperty('type')
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
    visit(ast, null, visitor);  

    return newAst;


}
export default transformer