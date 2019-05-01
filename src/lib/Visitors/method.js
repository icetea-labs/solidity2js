"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

function addCallBack(node) {
  // replace `_;` statements inside modifier by `callback()`
  node.forEach((value, index) => {
    if (value.type === "ExpressionStatement" && value.expression.name === '_') {
      value.expression = (0, _types.callExpression)((0, _types.identifier)('callback'), []);
    }
  });
}

var _default = {
  FunctionDefinition: function FunctionDefinition(node, parent) {
    node._context = [];
    node._context.modifiers = [];
  },
  'FunctionDefinition:exit': function FunctionDefinitionExit(node, parent) {
    let isConstructor = node.isConstructor;
    let hasModifier = node.modifiers.length !== 0 ? true : false;
    let methodNode;
    let functionParams = node._context[0]; // wrap function's body inside a block statement. Check if it is null because block statement require an array.

    let functionBody = node._context[1] ? (0, _types.blockStatement)(node._context[1]) : (0, _types.blockStatement)([]);

    if (hasModifier) {
      let blockBody = [];
      let nestedFunction = (0, _types.functionDeclaration)((0, _types.identifier)('nestedFunction'), functionParams, functionBody);
      blockBody.push(nestedFunction);

      node._context.modifiers.forEach(element => {
        element.arguments.push((0, _types.identifier)('nestedFunction'));
        blockBody.push((0, _types.expressionStatement)(element));
      });

      functionBody = (0, _types.blockStatement)(blockBody);
    } //FUTURE update: throw warning when user try to name another function or variable under the 'nestedFunction'


    if (isConstructor) {
      methodNode = (0, _types.classMethod)("constructor", (0, _types.identifier)("constructor"), functionParams, functionBody);
    } else {
      methodNode = (0, _types.classMethod)('method', (0, _types.identifier)(node.name), functionParams, functionBody);
    }

    const commentNode = {
      "type": "CommentLine",
      "value": "Pragma  version "
    };
    methodNode.innerComments = [];
    methodNode.innerComments.push(commentNode);

    parent._context.push(methodNode);
  },
  ModifierDefinition: function ModifierDefinition(node, parent) {
    node._context = [];
  },
  'ModifierDefinition:exit': function ModifierDefinitionExit(node, parent) {
    node._context[0].push((0, _types.identifier)('callback'));

    addCallBack(node._context[1]);
    let modifierNode = (0, _types.classMethod)('method', (0, _types.identifier)(node.name), node._context[0], (0, _types.blockStatement)(node._context[1]));

    parent._context.push(modifierNode);
  },
  ModifierInvocation: function ModifierInvocation(node, parent) {
    node._context = [];
  },
  'ModifierInvocation:exit': function ModifierInvocationExit(node, parent) {
    parent._context.modifiers.push((0, _types.callExpression)((0, _types.identifier)(node.name), node._context));
  },
  Block: function Block(node, parent) {
    node._context = [];
  },
  'Block:exit': function BlockExit(node, parent) {
    parent._context.push(node._context);
  },
  ExpressionStatement: function ExpressionStatement(node, parent) {
    node._context = [];
  },
  'ExpressionStatement:exit': function ExpressionStatementExit(node, parent) {
    if (node._context[0]) {
      parent._context.push((0, _types.expressionStatement)(node._context[0]));
    }
  },
  ReturnStatement: function ReturnStatement(node, parent) {
    node._context = [];
  },
  'ReturnStatement:exit': function ReturnStatementExit(node, parent) {
    parent._context.push((0, _types.returnStatement)(node._context[0]));
  },
  ParameterList: function ParameterList(node, parent) {
    node._context = [];
  },
  'ParameterList:exit': function ParameterListExit(node, parent) {
    parent._context.push(node._context);
  },
  'Parameter': function Parameter(node, parent) {
    parent._context.push((0, _types.identifier)(node.name));
  },
  'FunctionCall': function FunctionCall(node, parent) {
    node._context = [];
  },
  'FunctionCall:exit': function FunctionCallExit(node, parent) {
    let args = node._context.slice(1);

    parent._context.push((0, _types.callExpression)(node._context[0], args));
  }
};
exports.default = _default;