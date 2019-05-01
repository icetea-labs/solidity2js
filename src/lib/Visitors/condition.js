"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

var _default = {
  IfStatement: function IfStatement(node, parent) {
    node._context = [];
  },
  'IfStatement:exit': function IfStatementExit(node, parent) {
    parent._context.push((0, _types.ifStatement)(node._context[0], (0, _types.blockStatement)(node._context[1]), node._context[2] === undefined ? null : (0, _types.blockStatement)(node._context[2])));
  },
  WhileStatement: function WhileStatement(node, parent) {
    node._context = [];
  },
  'WhileStatement:exit': function WhileStatementExit(node, parent) {
    parent._context.push((0, _types.whileStatement)(node._context[0], (0, _types.blockStatement)(node._context[1])));
  },
  DoWhileStatement: function DoWhileStatement(node, parent) {
    node._context = [];
  },
  'DoWhileStatement:exit': function DoWhileStatementExit(node, parent) {
    parent._context.push((0, _types.doWhileStatement)(node._context[0], (0, _types.blockStatement)(node._context[1])));
  },
  ForStatement: function ForStatement(node, parent) {
    node._context = [];
  },
  'ForStatement:exit': function ForStatementExit(node, parent) {
    parent._context.push((0, _types.forStatement)(node._context[0], node._context[1], node._context[2], (0, _types.blockStatement)(node._context[3])));
  },
  initExpressionNode: function initExpressionNode(node, parent) {
    node._context = [];
  },
  'initExpressionNode:exit': function initExpressionNodeExit(node, parent) {
    if (node._context[0] && node._context[0].type === 'ExpressionStatement') node._context[0] = node._context[0].expression;

    parent._context.push(node._context[0]);
  },
  conditionExpressionNode: function conditionExpressionNode(node, parent) {
    node._context = [];
  },
  'conditionExpressionNode:exit': function conditionExpressionNodeExit(node, parent) {
    parent._context.push(node._context[0]);
  },
  loopExpressionNode: function loopExpressionNode(node, parent) {
    node._context = [];
  },
  'loopExpressionNode:exit': function loopExpressionNodeExit(node, parent) {
    parent._context.push(node._context[0]);
  }
};
exports.default = _default;