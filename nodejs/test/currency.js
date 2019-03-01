const currency = require('./currencyEx');

console.log(currency.code, currency.symbol);
console.log(currency(1234).format());
console.log(currency(1234).format(true));

console.log(currency(1234.1234, {
  formatWithCode: true,
}).format());

console.log(currency(1234.567, {
  formatWithCode: false,
  formatWithSymbol: true,
}).format());

console.log('SAR');
currency.setCurrency('SAR');
console.log(currency.code, currency.symbol);

console.log(currency(1234).format());
console.log(currency(1234).format(true));

console.log(currency(1234.567, {
  formatWithCode: true,
}).format());

console.log(currency(1234.567, {
  formatWithCode: false,
  formatWithSymbol: true,
}).format());

console.log('USD');
currency.setCurrency('USD');
console.log(currency.code, currency.symbol);

console.log(currency(1234).format());
console.log(currency(1234).format(true));

console.log(currency(1234.567, {
  formatWithCode: true,
}).format());

console.log(currency(1234.567, {
  formatWithCode: false,
  formatWithSymbol: true,
}).format());

console.log('SAR xxx');
currency.setOptions({
  ...currency.currencies.SAR,
  formatWithCode: false,
  formatWithSymbol: true,
});
console.log(currency.code, currency.symbol);

console.log(currency(1234).format());
console.log(currency(1234).format(true));

console.log(currency(1234.567, {
  formatWithCode: true,
}).format());

console.log(currency(1234.567, {
  formatWithCode: false,
  formatWithSymbol: true,
}).format());

console.log('CNY');
currency.setCurrency('CNY');
console.log(currency.code, currency.symbol);

console.log(currency(1234).format());
console.log(currency(1234).format(true));
console.log(currency(1234).format(false));

console.log(currency(1234.567, {
  formatWithCode: true,
}).format());

console.log(currency(1234.567, {
  formatWithCode: false,
  formatWithSymbol: true,
}).format());