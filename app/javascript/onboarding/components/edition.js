import m from 'mithril'
import Store from '../store'

const button = {
  view: vnode => (
    m('.pointer.pv3.tc.w-31', {
      className: Store.edition === vnode.attrs.value ? 'bg-ocean white' : 'bg-white foam',
      onclick: () => { Store.edition = vnode.attrs.value },
    }, vnode.children)
  )
}

const Edition = {
  view: () => m(
    '.mb3',
    [
      m('label.db.foam.mb2', 'Edition'),
      m('.flex.fw4.justify-between', [
        m(button, { value: 1 }, '1st Edition'),
        m(button, { value: 2 }, '2nd Edition'),
        m(button, { value: 3 }, '3rd Edition'),
      ])
    ]
  )
}

export default Edition
