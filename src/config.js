const currentProtocol = typeof window !== 'undefined' ? window.location.protocol : 'http:'
const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost'

const config = {
  meta: {
    author: 'Libé Labo',
    title: 'Libération - ',
    url: '',
    description: '',
    image: '',
    xiti_id: 'test',
    tweet: '',
  },
  tracking: {
    active: false,
    format: 'resultats-municipales-2020',
    article: 'resultats-municipales-2020'
  },
  show_header: true,
  statics_url: process.env.NODE_ENV === 'production'
    ? 'https://www.liberation.fr/apps/static'
    : `${currentProtocol}//${currentHostname}:3003`,
  api_url: process.env.NODE_ENV === 'production'
    ? 'https://libe-labo-2.site/api'
    : `${currentProtocol}//${currentHostname}:3004/api`,
  stylesheet: 'libe-apps-template.css', // The name of the css file hosted at ${statics_url}/styles/apps/
  spreadsheet: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQQtrW86T9T9ZmOcV8PPBcVcC32U9rOy3siUr8NXnK3JG9QRnQ8g-CYuTBbBJspeJ7HEXF62zZw3gWL/pub?gid=1731761155&single=true&output=tsv' // The spreadsheet providing data to the app
}

module.exports = config
