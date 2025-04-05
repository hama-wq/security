const path = require('path');

const nextI18NextConfig = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    // The type expects localeDetection to be literally false:
    localeDetection: false
  },
  // This setting is used at build time (you can use it as a fallback).
  localePath: path.resolve('./public/locales')
};

module.exports = nextI18NextConfig;
