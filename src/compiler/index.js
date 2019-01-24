import parser from 'solidity-parser-antlr';
import jsGenerator from './jsGenerator'
import PluginArray from './plugins';
import prettier from "prettier/standalone";

const prettierOptions = {
    parser: "babel",
    plugins: [require("prettier/parser-babylon")]
};

export function compile(soliditySrc) {
    try {

        // Parse solidity source into a tree
        const ast = parser.parse(soliditySrc);

        // Apply plugins to the tree
        applyPlugins(parser, ast, PluginArray);

        console.log(ast);

        // Convert the tree to JS source
        const jsSrc = jsGenerator(ast);

        // format code to make it looks nice
        // const formattedSrc =  prettier.format(jsSrc, prettierOptions)

        // return formattedSrc;
        return jsSrc;

    } catch (e) {
        return String(e);
    }
}

function applyPlugins(parser, ast, plugins) {
    plugins.forEach((plugin => {
        parser.visit(ast, plugin);
    }))
}