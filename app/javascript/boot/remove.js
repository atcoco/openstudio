export default function(event) {
  const node = event.target, selector = node.dataset.remove

  if (!selector) return
  event.preventDefault()

  Array.prototype.forEach.call(document.querySelectorAll(selector), (x) => {
    x.innerHTML = ''
  })
}
