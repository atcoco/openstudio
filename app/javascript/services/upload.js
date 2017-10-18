import { get, post } from 'services/ajax'

const upload = (file, { payload, url }) => {
  const fd = new FormData
  Object.keys(payload).forEach(k => {
    fd.append(k, payload[k])
  })
  fd.append('file', file)
  return post(url, fd, { background: true })
}

const poll = (id, resolve, reject) => {
  get(`/photos/${id}/status`, {}, {
    background: true,
    extract: x => ({ status: x.status, body: x.responseText })
  })
    .then(xhr => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.body))
        } catch (e) {
          reject('Broken server response')
        }
      } else if (xhr.status === 204) {
        setTimeout(poll.bind(null, id, resolve, reject), 2000)
      }
    })
    .catch(error => {
      if (error.status === 404) {
        reject('Photo uploaded is not found')
      } else {
        reject('Something went wrong')
      }
    })
}

export default file => (
  new Promise((resolve, reject) => {
    get('/photos/new', {}, { background: true })
      .then(params => {
        upload(file, params)
          .then(() => { setTimeout(poll.bind(null, params.payload.key, resolve, reject), 2000) })
          .catch(reject)
      })
      .catch(reject)
  })
)
