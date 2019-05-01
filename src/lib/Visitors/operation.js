"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

var _default = {
  BinaryOperation: function BinaryOperation(node, parent) {
    node._context = [];
  },
  'BinaryOperation:exit': function BinaryOperationExit(node, parent) {
    /**
    operators are not supported yet: 
        '|=',
        '^=',
        '<<=',
        '>>=',
    */
    let operator = node.operator;
    let assignmentOps = ['+=', '-=', '*=', '/=', '%=', '='];
    let simpleOps = ['+', '-', '*', '/', '**', '%', '<<', '>>', '&', '|', '^', '<', '>', '<=', '>=', '==', '!='];
    let logicalOps = ['&&', '||'];

    if (assignmentOps.includes(operator)) {
      let expressionNode = (0, _types.assignmentExpression)(operator, node._context[0], node._context[1]);

      parent._context.push(expressionNode);

      return;
    }

    if (simpleOps.includes(operator)) {
      let expression = (0, _types.binaryExpression)(operator, node._context[0], node._context[1]);

      parent._context.push(expression);

      return;
    }

    if (logicalOps.includes(operator)) {
      let expression = (0, _types.logicalExpression)(operator, node._context[0], node._context[1]);

      parent._context.push(expression);

      return;
    }

    console.log("'".concat(operator, "' operator is not supported yet!"));
  },
  UnaryOperation: function UnaryOperation(node, parent) {
    node._context = [];
  },
  'UnaryOperation:exit': function UnaryOperationExit(node, parent) {
    /**
    operators are not supported yet: 
        'after', 'delete'
    */
    let prefix = node.isPrefix;
    let operator = node.operator;
    let supportedOps = ['+', '-', '!', '~', '++', '--'];

    if (operator === '++' || operator === '--') {
      parent._context.push((0, _types.updateExpression)(operator, node._context[0], prefix));
    } else if (supportedOps.includes(operator)) {
      parent._context.push((0, _types.unaryExpression)(operator, node._context[0]));
    } else {
      console.log("'".concat(operator, "' operator is not supported yet!"));
    }
  }
};
exports.default = _default;