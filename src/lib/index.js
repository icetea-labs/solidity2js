"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compile = compile;

var _solidityParserAntlr = _interopRequireDefault(require("solidity-parser-antlr"));

var _generator = _interopRequireDefault(require("@babel/generator"));

var _transformer = _interopRequireDefault(require("./transformer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formalizeSolidityAST(ast) {
  _solidityParserAntlr.default.visit(ast, {
    /**
    ForStatement: adding AST nodes holding 3 expressions node of the forStatement node,
    for easy transforming later.
    */
    ForStatement: function ForStatement(node) {
      node.initExpressionNode = {
        type: 'initExpressionNode',
        expression: node.initExpression
      };
      node.conditionExpressionNode = {
        type: 'conditionExpressionNode',
        expression: node.conditionExpression
      };
      node.loopExpressionNode = {
        type: 'loopExpressionNode',
        expression: node.loopExpression
      };
    }
  });
}

function compile(soliditySrc) {
  try {
    const solidityAst = _solidityParserAntlr.default.parse(soliditySrc);

    console.log(solidityAst);
    formalizeSolidityAST(solidityAst);
    const JsAst = (0, _transformer.default)(solidityAst);
    console.log(JsAst);
    const jsSrc = (0, _generator.default)(JsAst).code;
    return jsSrc;
  } catch (e) {
    return String(e);
  }
}