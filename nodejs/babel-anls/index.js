'use strict';

const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

function anls(input, output) {
  const inputCode = fs.readFileSync(input, 'UTF8');
  const ast = babylon.parse(inputCode);

  const identifierMap = Object.create(null);
  const literalMap = Object.create(null);

  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      if (identifierMap[name] != null) {
        ++identifierMap[name];
      } else {
        identifierMap[name] = 1;
      }
    },

    Literal(path) {
      const name = path.node.value;
      if (typeof name !== 'string') {
        return;
      }
      if (literalMap[name] != null) {
        ++literalMap[name];
      } else {
        literalMap[name] = 1;
      }
    },
  });

  function sortLength(map) {
    return Object.keys(map)
      .sort((a, b) => {
        let ret = b.length - a.length;
        if (ret === 0) {
          ret = map[b] - map[a];
        }
        return ret;
      })
      .map((name) => {
        return {
          name,
          frequency: map[name],
        }
      });
  }

  function sortFrequency(map) {
    return Object.keys(map)
    .sort((a, b) => {
      let ret = map[b] - map[a];
      if (ret === 0) {
        ret = b.length - a.length;
      }
      return ret;
    })
    .map((name) => {
      return {
        name,
        frequency: map[name],
      }
    });
  }

  const result = {
    identifierLength: sortLength(identifierMap),
    identifierFrequency: sortFrequency(identifierMap),
    literalLength: sortLength(literalMap),
    literalFrequency: sortFrequency(literalMap),
  };

  console.log('Identifier:');
  console.log('Length:');
  console.log(JSON.stringify(result.identifierLength.slice(0, 20)));
  console.log('Frequency:');
  console.log(JSON.stringify(result.identifierFrequency.slice(0, 20)));
  console.log('Literal:');
  console.log('Length:');
  console.log(JSON.stringify(result.literalLength.slice(0, 20)));
  console.log('Frequency:');
  console.log(JSON.stringify(result.literalFrequency.slice(0, 20)));

  fs.writeFileSync(output, JSON.stringify(result));
}

// anls(path.join(__dirname, 'index.js'), path.join(__dirname, 'build/output.json'));
anls(path.join(__dirname, '../../../lab4/lab4-2.4/build/outputs/bundle.rollup.min.js'), path.join(__dirname, 'build/output.json'));