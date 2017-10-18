import m from 'mithril'
import Store from '../store'

const button = {
  view: vnode => (
    m('.pointer.pv4.tc.w-48', {
      className: Store.paper === vnode.attrs.value ? 'bg-ocean white' : 'bg-white foam',
      onclick: () => { Store.paper = vnode.attrs.value },
    }, vnode.children)
  )
}

const Paper = {
  view: () => m(
    '.mb3',
    [
      m('label.db.foam.mb2', 'Select paper type for this edition'),
      m('.flex.fw4.justify-between', [
        m(button, { value: 0 }, 'Fine Art*'),
        m(button, { value: 1 }, 'RC Photo'),
      ]),

      m('p', '* Fine Art prints come in Baryta Hahnemühle 315g and are printed using Pigment inkjet printing on Epson P20 000'),
    ]
  )
}

export default Paper
