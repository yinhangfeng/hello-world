const I18n = require('i18n-js');

console.log(
  'defaultLocale',
  I18n.defaultLocale,
  'locale',
  I18n.locale,
  'currentLocale',
  I18n.currentLocale(),
  'fallbacks',
  I18n.fallbacks
);

I18n.defaultLocale = 'en';
I18n.locale = 'zh';

I18n.translations = {
  zh: {
    a1: 'zha1',
    a2: {
      a3: 'zha3',
    },
    i1: 'zhi1{{a}}',

    x1: 'x1{{locale}}',
  },

  en: {
    a1: 'ena1',
    a2: {
      a3: 'ena3',
    },
    i1: '{{a}}eni1',
  },

  xx: {
    a1: 'xxa1',
  },
};

console.log(
  I18n.t('a1'),
  I18n.t('a2.a3'),
  I18n.t('a2.a3', {
    locale: 'en',
  }),
  I18n.t('xx', {
    defaultValue: 'xxxxxx',
  }),
  I18n.t('i1', {
    a: 'aaaaa',
  })
);

console.log(
  I18n.t('x1', {
    locale: 'aaaaa',
  }),
  I18n.t('a1', {
    locale: 'xx',
  })
);
