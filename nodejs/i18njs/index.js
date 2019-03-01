const i18n = require('i18next');

i18n.init({
  fallbackLng: 'en',

  lng: 'en',

  resources: {
    zh: {
      translation: {
        a1: 'zha1',
        a2: {
          a3: 'zha3',
        },
        i1: 'zhi1{{a}}',
    
        x1: 'x1{{locale}}',
      },
    },
  
    en: {
      translation: {
        a1: 'ena1',
        a2: {
          a3: 'ena3',
        },
        i1: '{{a}}eni1',
      }
    },
  
    xx: {
      translation: {
        a1: 'xxa1',
      },
    },
  },

  // have a common namespace used around the full app
  // ns: ['common'],
  // defaultNS: 'common',

  debug: true,

  interpolation: {
    escapeValue: false, // not needed for react as it does escape per default to prevent xss!
  },
});

i18n.on('languageChanged', () => {
  console.log('languageChanged');
});

i18n.changeLanguage('zh');

console.log(i18n);

console.log(
  i18n.t('a1'),
  i18n.t('a2.a3'),
  i18n.t('a2.a3', {
    locale: 'en',
  }),
  i18n.t('xx', {
    defaultValue: 'xxxxxx1',
  }),
  i18n.t('i1', {
    a: 'aaaaa',
  })
);

console.log(
  i18n.t('x1', {
    locale: 'aaaaa',
  }),
  i18n.t('a1', {
    locale: 'xx',
  })
);
