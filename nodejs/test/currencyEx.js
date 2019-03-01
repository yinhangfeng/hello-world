// import currencyJS from 'currency.js';
const currencyJS = require('currency.js');

// https://www.xe.com/symbols.php
const currencies = {
  CNY: {
    code: 'CNY',
    symbol: '¥',
    formatWithSymbol: true,
    formatWithCode: false,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    formatWithSymbol: true,
    formatWithCode: false,
  },
  SAR: {
    code: 'SAR',
    symbol: '﷼',
    formatWithCode: true,
    formatWithSymbol: false,
  },
};

let settings;

// 扩展 format
const oriFormat = currencyJS.prototype.format;
currencyJS.prototype.format = function(useSymbol) {
  // HACK currency.js 源码中是 this._settings 编译之后的是 this.s
  const formatWithCode = this.s.formatWithCode;
  const result = oriFormat.call(this, formatWithCode ? undefined : useSymbol);

  if (formatWithCode && (useSymbol !== false)) {
    // formatWithCode 时 useSymbol 可以控制是否需要 code
    return `${result} ${this.s.code}`;
  } else if (result[0] === '﷼') {
    return result.slice(1) + '﷼';
  }
  return result;
};

/**
 * https://github.com/scurker/currency.js
 */
function currency(value, opts) {
  if (opts) {
    opts = {
      ...settings,
      ...opts,
    };

    if (opts.formatWithCode && opts.formatWithSymbol) {
      opts.formatWithSymbol = false;
    }
  } else {
    opts = settings;
  }
  return currencyJS(value, opts);
}

currency.currencies = currencies;

currency.setOptions = function(opts) {
  settings = {
    ...settings,
    ...opts,
  };
  currency.code = settings.code;
  currency.symbol = settings.symbol;
};

currency.setCurrency = function(code) {
  const currencyConfig = currencies[code];
  if (!currencyConfig) {
    if (__DEV__) {
      throw new Error('不支持的货币', code);
    }
    return;
  }

  currency.setOptions(currencyConfig);
}

currency.setOptions(currencies.CNY);

module.exports = currency;