import m from 'mithril'

const applyCSRF = (headers = {}) => {
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (meta === null) {
    return headers
  } else {
    return {...headers, 'X-CSRF-Token': meta.content}
  }
}

const optionsFor = (method, url, params = {}, options = {}) => {
  options = {...options, data: params, method: method, url: url}
  options.headers = method === 'GET'
    ? {...options.headers, 'X-Requested-With': 'XMLHTTPRequest'}
    : applyCSRF(options.headers)
  return options
}

export const del  = (url, params, options) => m.request(optionsFor('DELETE', url, params, options))
export const get  = (url, params, options) => m.request(optionsFor('GET',    url, params, options))
export const post = (url, params, options) => m.request(optionsFor('POST',   url, params, options))
export const put  = (url, params, options) => m.request(optionsFor('PUT',    url, params, options))
