"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

var _default = {
  UserDefinedTypeName: function UserDefinedTypeName(node, parent) {
    parent._context.type = node.type;
    parent._context.definedType = node.namePath;
  },
  ElementaryTypeName: function ElementaryTypeName(node, parent) {
    parent._context.type = node.type;
  },
  ArrayTypeName: function ArrayTypeName(node, parent) {
    parent._context.type = node.type;
    node._context = [];
  },
  TupleExpression: function TupleExpression(node, parent) {
    node._context = [];
  },
  'TupleExpression:exit': function TupleExpressionExit(node, parent) {
    let isArray = node.isArray;

    if (isArray) {
      parent._context.push((0, _types.arrayExpression)(node._context));
    } else {
      console.log('Javascript does not support Tupple data structure!');
    }
  },
  IndexAccess: function IndexAccess(node, parent) {
    node._context = [];
  },
  'IndexAccess:exit': function IndexAccessExit(node, parent) {
    let base = node._context[0];
    let index = node._context[1];
    let memberExpressionNode = (0, _types.memberExpression)(base, index, true);

    parent._context.push(memberExpressionNode);
  },
  NumberLiteral: function NumberLiteral(node, parent) {
    let number = parseInt(node.number);

    parent._context.push((0, _types.numericLiteral)(number));
  },
  StringLiteral: function StringLiteral(node, parent) {
    let string = node.value;

    parent._context.push((0, _types.stringLiteral)(string));
  },
  Identifier: function Identifier(node, parent) {
    parent._context.push((0, _types.identifier)(node.name));
  },
  MemberAccess: function MemberAccess(node, parent) {
    node._context = [];
  },
  'MemberAccess:exit': function MemberAccessExit(node, parent) {
    parent._context.push((0, _types.memberExpression)(node._context[0], (0, _types.identifier)(node.memberName)));
  },
  BooleanLiteral: function BooleanLiteral(node, parent) {
    parent._context.push((0, _types.booleanLiteral)(node.value));
  }
  /**
  Tasks:
  + Struct - user defined type name
   */

};
exports.default = _default;