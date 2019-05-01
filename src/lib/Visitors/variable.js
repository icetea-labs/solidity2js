"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _types = require("@babel/types");

var _default = {
  StateVariableDeclaration: function StateVariableDeclaration(node, parent) {
    node._context = [];
  },
  'StateVariableDeclaration:exit': function StateVariableDeclarationExit(node, parent) {
    //add decorator @state
    let visibility = node.variables[0].visibility;
    let isAnArray = node.variables[0].typeName.type;
    let value = node._context[0];
    if (!value && isAnArray) value = (0, _types.arrayExpression)([]);

    if (visibility === 'private') {
      const privateProp = (0, _types.classPrivateProperty)((0, _types.PrivateName)((0, _types.identifier)(node._context.name)), value);

      parent._context.push(privateProp);
    } else {
      // ONLY support Identifier at the moment
      const prop = (0, _types.classProperty)((0, _types.identifier)(node._context.name), value);

      parent._context.push(prop);
    }
  },
  VariableDeclarationStatement: function VariableDeclarationStatement(node, parent) {
    node._context = [];
  },
  'VariableDeclarationStatement:exit': function VariableDeclarationStatementExit(node, parent) {
    let type = node._context.type;

    let args = node._context.slice(1);

    switch (type) {
      case 'ArrayTypeName':
        // initial array
        let value = node._context[0] ? node._context[0] : (0, _types.arrayExpression)([]);
        let arrayNode = (0, _types.variableDeclaration)('var', [(0, _types.variableDeclarator)((0, _types.identifier)(node._context.name), value)]);

        parent._context.push(arrayNode);

        break;

      case 'ElementaryTypeName':
        let varNode = (0, _types.variableDeclaration)('var', [(0, _types.variableDeclarator)((0, _types.identifier)(node._context.name), node._context[0])]);

        parent._context.push(varNode);

        break;

      case 'UserDefinedTypeName':
        let newObjNode = (0, _types.variableDeclaration)('var', [(0, _types.variableDeclarator)((0, _types.identifier)(node._context.name), (0, _types.newExpression)((0, _types.identifier)(node._context.definedType), args))]);

        parent._context.push(newObjNode);

        break;

      default:
        console.log("type ".concat(type, " is not yet supported"));
        break;
    }
  },
  VariableDeclaration: function VariableDeclaration(node, parent) {
    /**
    FUTURE: <refactor code> moving 'variable declaration' from VariableDeclarationStatement to here.
    Obviously from this part, there is no initial value so if it does present, I will update it in the VariableDeclarationStatement
     */
    parent._context.name = node.name;
    node._context = parent._context;
  }
};
exports.default = _default;