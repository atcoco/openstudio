export default function(event) {
  const element = event.target, targetSelector = element.dataset.dismiss

  if (element.classList.contains('js-close') && targetSelector !== undefined) {
    const target = element.closest(targetSelector)

    if (target !== null && target.parentElement !== null) {
      event.preventDefault()
      target.parentElement.removeChild(target)
    }
  }
}
