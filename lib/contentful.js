/**
 * Contentful Delivery API SDK. Allows you to create instances of a client
 * with access to the Contentful Content Delivery API.
 * @namespace contentful
 * @see ContentfulClientAPI
 */

import axios from 'axios'
import {createHttpClient, getUserAgentHeader} from 'contentful-sdk-core'
import createContentfulApi from './create-contentful-api'
import createLinkResolver from './create-link-resolver'
/**
 * Create a client instance
 * @func
 * @name createClient
 * @memberof contentful
 * @param {Object} params - Client initialization parameters
 * @prop {string} params.space - Space ID
 * @prop {string} params.accessToken - Contentful CDA Access Token
 * @prop {boolean=} params.insecure - Requests will be made over http instead of the default https (default: true)
 * @prop {string=} params.host - API host (default: cdn.contentful.com). Also usable with preview.contentful.com.
 * @prop {string=} params.basePath - Path appended to the host to support gateways/proxies with custom urls.
 * @prop {Object=} params.httpAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.httpsAgent - Optional Node.js HTTP agent for proxying (see <a href="https://nodejs.org/api/http.html#http_class_http_agent">Node.js docs</a> and <a href="https://www.npmjs.com/package/https-proxy-agent">https-proxy-agent</a>)
 * @prop {Object=} params.proxy - Optional Axios proxy (see <a href="https://github.com/mzabriskie/axios#request-config"> axios docs </a>)
 * @prop {Object=} params.headers - Optional additional headers
 * @prop {boolean=?} params.resolveLinks - If we should resolve links between entries (default: true)
 * @prop {boolean=?} params.retryOnError - If we should retry on errors and 429 rate limit exceptions (default: true)
 * @prop {string=?} params.application - Application name and version e.g myApp/version
 * @prop {string=?} params.integration - Integration name and version e.g react/version
 * @returns {ContentfulClientAPI.ClientAPI}
 * @example
 * const contentful = require('contentful')
 * const client = contentful.createClient({
 *  accessToken: 'myAccessToken',
 *  space: 'mySpaceId'
 * })
 */

export function createClient (params) {
  if (!params.accessToken) {
    throw new TypeError('Expected parameter accessToken')
  }

  if (!params.space) {
    throw new TypeError('Expected parameter space')
  }

  // Use resolveLinks param if specified, otherwise default to true
  const resolveLinks = !!('resolveLinks' in params ? params.resolveLinks : true)
  const shouldLinksResolve = createLinkResolver(resolveLinks)
  const userAgentHeader = getUserAgentHeader(`contentful.js/${__VERSION__}`,
    params.application,
    params.integration
  )
  params.defaultHostname = 'cdn.contentful.com'
  params.headers = {
    ...params.headers,
    'Content-Type': 'application/vnd.contentful.delivery.v1+json',
    'X-Contentful-User-Agent': userAgentHeader
  }

  const http = createHttpClient(axios, params)

  return createContentfulApi({
    http: http,
    shouldLinksResolve: shouldLinksResolve
  })
}
