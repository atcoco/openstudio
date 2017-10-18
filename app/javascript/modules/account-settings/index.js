import m from 'mithril'
import info from './info'
import signature from './signature'

const modes = [ info, signature ]

const modeSwitch = {
  view: vnode => (
    m('a.f4.fw5.link.mr4', {
      className: vnode.attrs.active ? 'ocean' : 'foam',
      href: 'javascript:;',
      onclick: vnode.attrs.activate,
    }, vnode.children)
  )
}

export default vnode => {
  const params = vnode.attrs.params
  const payload = vnode.attrs.payload
  const root = vnode.attrs.root

  let mode = parseInt(params.index) || 0

  return {
    view: () => (
      m('.montserrat.pv4', [
        m('h1.cardo.f2.fw4.night', 'Account settings'),

        m('.mv5', [
          m(modeSwitch, { activate: () => { mode = 0 }, active: mode === 0 }, 'Account information'),
          m(modeSwitch, { activate: () => { mode = 1 }, active: mode === 1 }, 'Authencity Certificate')
        ]),

        m(modes[mode], { params, payload, root })
      ])
    ),
  }
}
