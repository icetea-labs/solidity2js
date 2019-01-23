const states = {};
const defValue = (type, name) => {
  if (type === 'ElementaryTypeName') {
    return ["string", "address"].includes(name) ? "''" : 0;
  }
  if (type === "ArrayTypeName") {
    return [];
  }
  return {};
}
const capitalize = (t) => {
  return `${t.charAt(0).toUpperCase()}${t.slice(1)}`;
}
const jsGenerator = (node) => {
  switch (node.type) {
    case 'SourceUnit':
      return node.children.map(jsGenerator).join('\n').trim();

    case 'PragmaDirective':
      return '/* @autobinding */';

    case 'ContractDefinition':
      {
        let s = '';
        if (node.baseContracts.length) {
          s = "extends " + node.baseContracts.map(jsGenerator);
        }
        return (
          `@contract class ${node.name} ${s}{
${node.subNodes.map(jsGenerator).join('\n')}
}`
        );
      }

    case 'EventDefinition':
      // return `// ${node.name}(${node.parameters.parameters.map(jsGenerator).join(',')})`
      return '/* WARN: event declaration not yet supported */';

    case 'FunctionDefinition':
      if (node.isConstructor) {
        return `\n// Transform from Solidity constructor
@on('deployed') onDeployed(${node.parameters.parameters.map(jsGenerator)}) {
${jsGenerator(node.body)}
}`
      } else if (node.name === "") {
        return `\n// Transform from Solidity fallback function
@on('received') onReceived(${node.parameters.parameters.map(jsGenerator)}) {
${jsGenerator(node.body)}
}`
      } else {
        states[node.name] = node.visibility;
        if (node.visibility === "private") {
          return `\n#${node.name} = (${node.parameters.parameters.map(jsGenerator)}) => {
${jsGenerator(node.body)}
}`
        } else {
          const mutable = node.stateMutability ? ("@" + node.stateMutability + " ") : "";
          return `\n${mutable}${node.name}(${node.parameters.parameters.map(jsGenerator)}) {
${jsGenerator(node.body)}
}`
        }
      };

    case 'Block':
      return node.statements.map(jsGenerator).join('\n');

    case 'ExpressionStatement':
      return jsGenerator(node.expression);

    case 'StateVariableDeclaration':
      {
        const v = node.variables[0];
        states[v.name] = v.visibility;
        let initVal = '';
        if (node.initialValue) {
          initVal = jsGenerator(node.initialValue);
        } else {
          initVal = defValue(v.typeName.type, v.typeName.name);
        }

        const p = (v.visibility === "private" ? "#" : "");

        let s = `${p}get${capitalize(v.name)} = () => {
return this.hasState('${v.name}')?this.getState('${v.name}'):${initVal};
}
${p}set${capitalize(v.name)} = (${v.name}) => {
return this.setState('${v.name}', ${v.name});
}`
        return s;
      }

    case 'VariableDeclarationStatement':
      {
        const v = node.variables[0];
        let s = v.isDeclaredConst ? "const " : "let " + v.name;

        if (node.initialValue) {
          s += " = " + jsGenerator(node.initialValue);
        } else {
          if (v.typeName.type === "ArrayTypeName") {
            s += " = []"
          } else if (v.typeName.type === "Mapping") {
            s += " = {}"
          }
        }

        return s;
      }

    case 'ReturnStatement':
      return 'return ' + jsGenerator(node.expression);

    case 'StringLiteral':
      return `'${node.value}'`;

    case 'NumberLiteral':
      return node.number;

    case 'VariableDeclaration':
      return node.name;

    case 'Parameter':
      return node.name;

    case 'BinaryOperation':
      {
        if (node.operator.endsWith("=") && !node.operator.startsWith("==")
           && node.left.type === "Identifier" && !!states[node.left.name]) {
          return `this.${states[node.left.name]==='private'?'#':''}set${capitalize(node.left.name)}(${jsGenerator(node.right)})`;
        } else {
          return jsGenerator(node.left) + node.operator + jsGenerator(node.right)
        }
      }
    case 'IndexAccess':
      return `${jsGenerator(node.base)}[${jsGenerator(node.index)}]`;

    case 'Identifier':
      {
        let s = '';
        const isState = !!states[node.name];
        if (isState) {
          if (states[node.name]) s = "this.";
          if (states[node.name] === "private") {
            s += "#get";
          } else {
            s += "get";
          }
          return `${s}${capitalize(node.name)}()`;
        } else {
          return node.name;
        }
      }

    case 'MemberAccess':
      return jsGenerator(node.expression) + "." + node.memberName;

    case 'FunctionCall':
      {
        return `${jsGenerator(node.expression)}(${node.arguments.map(jsGenerator).join(', ')})`;
      }
    case 'TupleExpression':
      return "[" + node.components.map(jsGenerator) + "]";

    case 'ImportDirective':
      return `import '${node.path}'`;

    case 'NewExpression':
      return `new ${node.typeName.namePath}`;

    case 'UserDefinedTypeName':
      return node.namePath;

    case 'InheritanceSpecifier':
      return node.baseName.namePath;

    case 'EmitStatement':
      return '/* WARN: emit not yet supported */';

    case 'StructDefinition':
      {
        states[node.name] = "default";
        let s = [];
        let m = [];
        node.members.forEach((v) => {
          s.push(v.name);
          m.push(`"${v.name}": ${v.name}`);
        });
        return `${node.name}(${s.join(',')}){
return {
${m.join(",\n")}
}
}`;

      }
    case 'ModifierDefinition':
      return '/* WARN: modifier definition not yet supported */';

    case 'ModifierInvocation':
      return '/* WARN: modifier invocation not yet supported */';

    case 'UnaryOperation':
      return jsGenerator(node.subExpression) + node.operator;

    default:
      console.log("Unregconized node: ", node);
      return '';
  }
};

export default jsGenerator;