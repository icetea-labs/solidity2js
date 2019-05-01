"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _common = _interopRequireDefault(require("./common"));

var _contract = _interopRequireDefault(require("./contract"));

var _method = _interopRequireDefault(require("./method"));

var _operation = _interopRequireDefault(require("./operation"));

var _variable = _interopRequireDefault(require("./variable"));

var _condition = _interopRequireDefault(require("./condition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = Object.assign(_common.default, _contract.default, _method.default, _operation.default, _variable.default, _condition.default);

exports.default = _default;