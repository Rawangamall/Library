import path from "path"; 
const i18n = require('i18n');

i18n.configure({
    locales:['en','ar'],
    directory: path.join(__dirname , "./../../../locales"),
    defaultLocale: 'en',
    queryParameter: 'lang', 
    api: {
        '__': 'translate',  // Use 'translate' as alias for 'res.__' function
        '__n': 'translateN' // Use 'translateN' as alias for 'res.__n' function
      }
})

export default i18n;