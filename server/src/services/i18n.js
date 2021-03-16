const i18n = require('i18n')
const path = require('path')

i18n.configure({
  locales: ['fr'],
  defaultLocale: 'fr',
  queryParameter: 'lang',
  directory: path.join( __dirname, '../../locales' ),
  updateFiles: false
})

i18n.setLocale( 'fr' )

module.exports = i18n
