import {file, program} from "@babel/types";
import visitor from './Visitors'

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

    try {
      traverseNode.operationsByType[node.type](node)
    } catch (error) {
      console.log(`missing ${node.type} case in traverseNode.operationsByType`)
      console.log(error)
    }
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
    FunctionDefinition: (node) => {
      traverseNode(node.parameters, node);
      traverseNode(node.body, node)
    },
    ParameterList: (node) => {
      traverseArray(node.parameters, node);
    },
    ExpressionStatement: (node) => {
      traverseNode(node.expression, node)
    },
    IfStatement: (node) => {
      traverseNode(node.condition, node);
      traverseNode(node.trueBody, node);
      traverseNode(node.falseBody, node);
    },
    Block: (node) => {
      traverseArray(node.statements, node)
    },
    VariableDeclarationStatement: (node) => {
      traverseArray(node.variables, node);
      traverseNode(node.initialValue, node)
    },
    ReturnStatement: (node) => {
      traverseNode(node.expression, node)
    },
    BinaryOperation: (node) => {
      traverseNode(node.left, node);
      traverseNode(node.right, node);	
    },
    UnaryOperation: (node) => {
      traverseNode(node.subExpression, node);
    },
    Identifier: () => {},
    MemberAccess: (node) => {
      traverseNode(node.expression, node)
    },
    PragmaDirective: () => {},
    VariableDeclaration: (node) => {
      traverseNode(node.typeName, node)
    },
    BooleanLiteral: function(){},
    UserDefinedTypeName: function(){},
    ElementaryTypeName: () => {},
    NumberLiteral: () => {},
    StringLiteral: () => {},
    Parameter: () => {},
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
    traverser(ast, visitor)
    return newAst;


}
export default transformer