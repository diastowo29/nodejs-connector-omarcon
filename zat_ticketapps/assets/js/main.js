// Initialise Apps framework client. See also:
// https://developer.zendesk.com/apps/docs/developer-guide/getting_started
const client = ZAFClient.init()

// Vuetify settings
const vuetify = new Vuetify({
  icons: {
    iconfont: 'fa'
  },
  theme: {
    themes: {
      light: {
        primary: '#03363D',
        secondary: '#424242'
      }
    }
  }
})

// General functions
///////////////////////////////////////////////////////////////////////////////

// Format number to money format
// Input example: formatMoney(33.90, '€')
function formatMoney(number, currencySymbol) {
  return (
    (currencySymbol || '$') +
    parseFloat(number)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,')
  )
}

// Return date as a string
// Accepted values: any date format or 'yesterday'
function dateToString(date) {
  let rawDate = date

  switch (date) {
    case 'today':
      rawDate = new Date()
      break

    case 'yesterday':
      rawDate = new Date().setDate(new Date().getDate() - 1)
      break

    case 'tomorrow':
      rawDate = new Date().setDate(new Date().getDate() + 1)
      break

    default:
      rawDate = new Date(date)
      break
  }

  const strDate = new Date(rawDate).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return strDate
}

// Resize app based on the app container height
function resizeApp() {
  const appContainer = document.querySelector('#app .app-container')
  const appHeight = appContainer && appContainer.offsetHeight + 'px'

  if (appContainer && appHeight) {
    client.invoke('resize', { width: '100%', height: appHeight })
  }
}
