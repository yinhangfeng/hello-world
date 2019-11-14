const _ = require('lodash');

const countries = [
  {
    name: 'China',
    currencyCode: 'CNY',
  },
  {
    name: 'United States',
    currencyCode: 'USD',
  },
  {
    name: 'Saudi Arabia',
    currencyCode: 'SAR',
  },
  {
    name: 'Algieria',
    currencyCode: 'DZD',
  },
  {
    name: 'Bahrain',
    currencyCode: 'BHD',
  },
  {
    name: 'Comoros',
    currencyCode: 'KMF',
  },
  {
    name: 'Djibouti',
    currencyCode: 'DJF',
  },
  {
    name: 'Egy',
    currencyCode: 'EGP',
  },
  {
    name: 'Iraq',
    currencyCode: 'IQD',
  },
  {
    name: 'Jordan',
    currencyCode: 'JOD',
  },
  {
    name: 'Kuwait',
    currencyCode: 'KWD',
  },
  {
    name: 'Lebanon',
    currencyCode: 'LBP',
  },
  {
    name: 'Libya',
    currencyCode: 'LYD',
  },
  {
    name: 'Mauritania',
    currencyCode: 'MRO',
  },
  {
    name: 'Morocco',
    currencyCode: 'MAD',
  },
  {
    name: 'Oman',
    currencyCode: 'OMR',
  },
  // {
  //   name: 'Palestine',
  //   currencyCode: 'No universal currency',
  // },
  {
    name: 'Qatar',
    currencyCode: 'QAR',
  },
  {
    name: 'Somalia',
    currencyCode: 'SOS',
  },
  {
    name: 'Sudan',
    currencyCode: 'SDD',
  },
  {
    name: 'Syria',
    currencyCode: 'SYP',
  },
  {
    name: 'Tunisia',
    currencyCode: 'TND',
  },
  {
    name: 'United Arab Emirates',
    currencyCode: 'AED',
  },
  {
    name: 'Yemen',
    currencyCode: 'YER',
  },
];

const flagImports = [];
const countriesEx = countries.map(it => {
  const x = _.camelCase(it.name);
  const y = it.name.replace(/\s+/g, '');
  const flag24Var = `ic24Flag${y}`;
  const flag48Var = `ic48Flag${y}`;
  flagImports.push(`import ${flag24Var} from '$/assets/country/ic_24_flag_${y}`);
  flagImports.push(`import ${flag48Var} from '$/assets/country/ic_48_flag_${y}`);
  return {
    name: `t('country.${x}')`,
    currencyCode: it.currencyCode,
    flag24: flag24Var,
    flat48: flag48Var,
  };
});
console.log(
  JSON.stringify(countriesEx)
);

const xxx = {};
for (let c of countries) {
  const x = _.camelCase(c.name);
  xxx[x] = c.name;
}

console.log();
console.log(JSON.stringify(xxx));

const currencies = countries.map((c, index) => {
  return {
    code: c.currencyCode,
    symbol: c.currencyCode,
    currencyType: index,
    label: `t('currency.${c.currencyCode}.label')`,
  };
});

console.log();
console.log(JSON.stringify(currencies));

const currencyL = {};
for (let c of countries) {
  currencyL[c.currencyCode] = {
    label: c.currencyCode,
  };
}

console.log();
console.log(JSON.stringify(currencyL));