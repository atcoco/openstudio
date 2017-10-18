import m from 'mithril'

const normalize = x => x > 100 ? 100 : x < 0 ? 0 : x

const component = {
  oninit: vnode => {
    vnode.state.value = normalize(parseFloat(vnode.attrs.value) || 0)
    vnode.state.labelFn = vnode.attrs.labelFn || (x => x.toFixed())
  },

  keydown: (vnode, e) => {
    switch (e.keyCode) {
    case 37: // left arrow
      vnode.state.value = normalize(vnode.state.value - 1)
      break
    case 39: // right arrow
      vnode.state.value = normalize(vnode.state.value + 1)
      break
    }
    vnode.attrs.onchange && vnode.attrs.onchange(vnode.state.value)
  },

  moveTo: (vnode, x) => {
    vnode.state.value = normalize(100 * x / vnode.dom.clientWidth)
    vnode.attrs.onchange && vnode.attrs.onchange(vnode.state.value)
  },

  mousemove: (vnode, e) => {
    if (e.buttons === 0) return
    component.moveTo(vnode, e.x - vnode.dom.offsetLeft)
  },

  mousedown: (vnode, e) => {
    component.moveTo(vnode, e.x - vnode.dom.offsetLeft)
  },

  view: vnode => (
    m('.outline-0.range-slider.w-100', {
      onkeydown: component.keydown.bind(null, vnode),
      onmousedown: component.mousedown.bind(null, vnode),
      onmousemove: component.mousemove.bind(null, vnode),
      tabIndex: -1,
    }, [
      m('.range-bar.bg-white'),
      m('.range-bar-active.bg-spring', { style: { right: `${100 - vnode.state.value}%` } }),
      m('.range-thumb-handle', { style: { left: `${vnode.state.value}%` } },
        m('.range-thumb-label', vnode.state.labelFn(vnode.state.value)),
        m('.range-thumb.ba.b--white.bg-white')
      ),
    ])
  )
}

export default component
