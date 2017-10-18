import m from 'mithril'
import Store from '../store'

const button = {
  classes: vnode => (
    [
      Store.selectedSizeIndexes.indexOf(vnode.attrs.value) === -1 ? 'bg-white foam' : 'bg-ocean white',
      vnode.attrs.enabled ? 'pointer' : 'not-allowed o-30',
    ].filter(x => x).join(' ')
  ),

  view: vnode => (
    m('.mb2.pv3.tc.w-31', {
      className: button.classes(vnode),
      onclick: () => { vnode.attrs.enabled && Store.toggleSize(vnode.attrs.value) }
    }, vnode.children)
  )
}


const Size = {
  view: () => m(
    '.mv2',
    [
      m('.foam.mb3.relative.select-dropdown',
        m('select.bg-white.bn.db.foam.input-reset.outline-0.pv2.ph1.w-100',
          {
            onchange: (e) => { Store.dimension = e.target.value },
            value: Store.dimension,
          },
          Store.formats.map(f => m('option', { value: f.name }, `Select dimension (${f.plural})`))
        )
      ),

      m('label.db.foam.mb2', 'Select image sizes for this edition'),
      m('.flex.flex-wrap.fw4.justify-between',
        Store.allSizes().map((s, i) =>
          m(button, {
            enabled: Store.maxSizeIndex >= i,
            key: s,
            value: i
          }, `${s}${Store.format.short}`))
      )
    ]
  )
}

export default Size
