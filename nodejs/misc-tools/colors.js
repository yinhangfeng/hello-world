const colors = require('material-ui/styles/colors');

const colorTypes = [
  'red',
  'purple',
  'indigo',
  'lightBlue',
  'teal',
  'lightGreen',
  'yellow',
  'orange',
  'brown',
  'blueGrey',
  'pink',
  'deepPurple',
  'blue',
  'cyan',
  'green',
  'lime',
  'amber',
  'deepOrange',
  // 'grey',
];

const result = [];

const weights = [500, 200, 900];

for (let weight of weights) {
  for (let type of colorTypes) {
    result.push(colors[`${type}${weight}`]);
  }
}

console.log(result);

console.log(JSON.stringify(result));

let resultCss = 'div {';
for (let color of result) {
  resultCss += `color: ${color};`;
}
resultCss += '}';

console.log(resultCss)
