import { get, post } from 'services/ajax'

export const handleRemoteClick = event => {
  const node = event.target, targetSelector = node.getAttribute('href'), url = node.dataset.remote

  if (!url || !targetSelector) return
  event.preventDefault()
  
  get(url, {}, {
    deserialize: x => x,
    headers: { 'Content-Type': 'text/html' }
  }).then(response => {
    const target = document.querySelector(targetSelector)
    target.innerHTML = response
  })
}

export const handleRemoteSubmit = event => {
  const form = event.target

  if (!form.dataset.remote) return
  event.preventDefault()

  const fd = new FormData
  Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), ctrl => {
    fd.append(ctrl.name, ctrl.value)
  })
  post(form.action, fd, {
    deserialize: x => x,
    extract: x => ({ status: x.status, body: x.responseText })
  })
    .then(() => { location.reload() })
    .catch(xhr => {
      console.debug(xhr)
      form.parentNode.innerHTML = xhr.body
    })
}
