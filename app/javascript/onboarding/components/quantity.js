import m from 'mithril'
import Store from '../store'

const button = {
  view: vnode => (
    m('.pointer.mb2.pv3.tc.w-31', {
      className: Store.quantity === vnode.attrs.value ? 'bg-ocean white' : 'bg-white foam',
      onclick: () => { Store.quantity = vnode.attrs.value },
    }, vnode.children)
  )
}

const Quantity = {
  view: () => m(
    '.mb3',
    [
      m('label.db.foam.mb2', 'How many prints do you want in this edition?'),
      m('.flex.flex-wrap.fw4.justify-between', [
        m(button, { value:  3 }, '3 Prints'),
        m(button, { value: 10 }, '10 Prints'),
        m(button, { value: 20 }, '20 Prints'),
        m(button, { value: 30 }, '30 Prints'),
        m(button, { value:  -1 }, 'Open'),
      ])
    ]
  )
}

export default Quantity
