'use strict';

const fs = require('fs');
const path = require('path');
const babelCore = require('babel-core');
// const generate = require('babel-generator').default;

function TestPlugin(babel, options) {
  const t = babel.types;

  return {
    visitor: {
      VariableDeclaration(path) {
        console.log('VariableDeclaration enter');
        // 只处理顶层requireComp
        if (!t.isProgram(path.parent)) {
          return;
        }
        return;
        const node = path.node;
        if (node.declarations.length !== 1) {
          return;
        }

        const variableDeclarator = node.declarations[0];
        const callExpression = variableDeclarator.init;
        if (!t.isCallExpression(callExpression)) {
          return;
        }

        if (!callExpression.arguments || callExpression.arguments.length !== 1 || !t.isLiteral(callExpression.arguments[0])) {
          return;
        }

        if (!(
          (t.isIdentifier(callExpression.callee) && callExpression.callee.name === 'requireComp') ||
          (t.isMemberExpression(callExpression.callee) && t.isIdentifier(callExpression.callee.property) && callExpression.callee.property.name === 'requireComp')
        )) {
          return;
        }

        const importName = variableDeclarator.id.name;
        const compName = callExpression.arguments[0].value;

        const importDefaultSpecifier = t.importDefaultSpecifier(t.identifier(importName));
        path.replaceWith(
          t.importDeclaration([importDefaultSpecifier], t.stringLiteral('xxx/' + compName))
        );
      },
    },
  };
}

// const inputCode = fs.readFileSync(path.join(__dirname, 'example-code.js'));
const inputCode = fs.readFileSync(path.join(__dirname, 'test1.js'));

const transformResult = babelCore.transform(inputCode, {
  plugins: [TestPlugin],
  sourceMaps: true,
});

console.log(transformResult.code, transformResult.map);