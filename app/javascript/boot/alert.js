export default function() {
  const flash = document.querySelector('.flash-messages > .alert')
  if (flash !== null) {
    if (typeof top.jQuery === 'function') {
      top.$(flash).slideUp('fast')
    } else {
      flash.parentNode.removeChild(flash)
    }
  }
}
