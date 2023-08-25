// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */

module.exports = {
  // https://www.i18next.com/overview/configuration-options#logging
  debug: process.env.NODE_ENV === 'development',
  i18n: {
    defaultLocale: _DEFAULT_LOCALE_, // 'en',
    locales: [_LOCALES_], // ['en'],
    // defaultLocale: 'en',
    // locales: ['en'],
    localeDetection: true,
  },

  /** To avoid issues when deploying to some paas (vercel...) */
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',

  reloadOnPrerender: process.env.NODE_ENV === 'development',

  defaultNS: 'common',
  ns: [__NS__],
  // ns: ['common', 'main'],
  // localeStructure: '{{lng}}/{{ns}}',
  // localeExtension: 'json',

  // lng: 'en',
  // fallbackLng: ['ru', 'en'],
  keySeparator: '.',
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
  },


  /**
   * @link https://github.com/i18next/next-i18next#6-advanced-configuration
   */
  // saveMissing: false,
  // strictMode: true,
  // serializeConfig: false,
  react: {
    useSuspense: false,
    wait: true
  },
}