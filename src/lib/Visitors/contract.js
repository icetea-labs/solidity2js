"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

var _default = {
  //add @contract 
  ContractDefinition: function ContractDefinition(node, parent) {
    const classNode = (0, _types.classDeclaration)((0, _types.identifier)(node.name), undefined, (0, _types.classBody)([]));
    node._context = classNode.body.body;

    parent._context.push(classNode);
  },
  //default adding function require() to contract
  'ContractDefinition:exit': function ContractDefinitionExit(node, parent) {
    let body = (0, _types.blockStatement)([(0, _types.ifStatement)((0, _types.identifier)('!condition'), (0, _types.blockStatement)([(0, _types.throwStatement)((0, _types.newExpression)((0, _types.identifier)('Error'), [(0, _types.identifier)('errorMessage')]))]))]);
    let requireMethodNode = (0, _types.classMethod)('method', (0, _types.identifier)('require'), [(0, _types.identifier)('condition'), (0, _types.identifier)('errorMessage')], body);

    node._context.push(requireMethodNode);
  },
  PragmaDirective: function PragmaDirective(node, parent) {
    const commentNode = {
      "type": "CommentLine",
      "value": "Pragma ".concat(node.name, " version ").concat(node.value)
    };
    parent.comments.push(commentNode);
    parent.innerComments.push(commentNode);
  }
};
exports.default = _default;