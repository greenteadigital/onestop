import React from 'react'
import {render} from 'react-dom'
import Result from './result/Result'
import CollectionsContainer from './result/collections/CollectionsContainer'
import GranuleListContainer from './result/granules/GranuleListContainer'
import ErrorContainer from './error/ErrorContainer'
import LandingContainer from './landing/LandingContainer'
import DetailContainer from './detail/DetailContainer'
import Help from './common/info/Help'
import AboutContainer from './common/info/AboutContainer'
import {Provider} from 'react-redux'
import RootContainer from './root/RootContainer'
import {initialize} from './actions/FlowActions'
import '../style/style'
import './fonts.css'
import './page.css'
import './media.css'
import store from './store'
import history from './history'
import './leaflet-init'

import { Route } from 'react-router'
import { ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

const browserHistory = createHistory()

store.dispatch(initialize())

/*
const routesLayout = (
  <Router history={history}>
    <Route path="/" name="Home" component={RootContainer}>
      <IndexRoute component={LandingContainer} />
      <Route name="Collections" path="collections" component={Result}>
        <IndexRoute
          displayName="Collections"
          component={CollectionsContainer}
        />
      </Route>
      <Route
        name="Details"
        path="collections/details/:id"
        component={DetailContainer}
      />
      <Route
        name="GranuleDetail"
        path="collections/granules/:id"
        component={GranuleListContainer}
      />
      <Route name="Error" path="error" component={ErrorContainer} />
      <Route name="Help" path="help" component={Help} />
      <Route name="About" path="about" component={AboutContainer} />
    </Route>
  </Router>
)
*/

const body = (
  <Provider store={store}>
    <ConnectedRouter history={browserHistory}>
            <RootContainer />
        </ConnectedRouter>
  </Provider>
)

const appDiv = document.createElement('div')
appDiv.setAttribute('id', 'app')
appDiv.setAttribute('style', 'height:100%')
document.body.appendChild(appDiv)

const fedAnalyticsScript = document.createElement('script')
fedAnalyticsScript.insertAdjacentHTML(
  'afterbegin',
  'window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;' +
    "ga('create', 'UA-108560292-1', 'data.noaa.gov');" +
    "ga('set', 'anonymizeIp', true);" +
    "ga('send', 'pageview');"
)
document.body.appendChild(fedAnalyticsScript)

const googleAnalytics = document.createElement('script')
googleAnalytics.setAttribute(
  'src',
  'https://www.google-analytics.com/analytics.js'
)
googleAnalytics.setAttribute('type', 'text/javascript')
googleAnalytics.setAttribute('async', 'true')
document.body.appendChild(googleAnalytics)

const rootUrl = `${window.location.origin + window.location.pathname}`

const jsonLdScript = document.createElement('script')
jsonLdScript.setAttribute('type', 'application/ld+json')
jsonLdScript.insertAdjacentHTML(
  'afterbegin',
  `{
    "@context": "http://schema.org",
    "@type": "WebSite",
    "@id": "${rootUrl}",
    "url": "${rootUrl}",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "${rootUrl}#/collections?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://www.ncei.noaa.gov/",
      "name": "National Centers for Environmental Information (NCEI)",
      "logo": {
          "@type": "ImageObject",
          "url": "https://www.ncei.noaa.gov/sites/default/files/noaa_logo_circle_72x72.svg",
          "width": "72",
          "height": "72"
      }
    }
  }`
)
document.body.appendChild(jsonLdScript)

const ogUrlMetaTag = document.createElement('meta')
ogUrlMetaTag.setAttribute('property', 'og:url')
ogUrlMetaTag.setAttribute('content', `${rootUrl}`)
document.head.appendChild(ogUrlMetaTag)

const baseRef = document.createElement('base')
baseRef.setAttribute('href', '/onestop/')
document.head.appendChild(baseRef)

render(body, appDiv)
