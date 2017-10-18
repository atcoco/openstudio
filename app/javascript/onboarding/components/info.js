import m from 'mithril'
import Store from '../store'

const Quantity = {
  view: () => m('.mb3', [
    m('input.bg-white.bn.mb3.montserrat.ocean.outline-0.pa3.p-tint.w-100', {
      oninput: m.withAttr('value', Store.title),
      placeholder: 'Enter title',
      type: 'text',
      value: Store.title(),
    }),

    m('textarea.bg-white.bn.mb3.montserrat.ocean.outline-0.pa3.p-tint.w-100', {
      oninput: m.withAttr('value', Store.description),
      placeholder: 'Please enter description here',
      rows: 5,
      value: Store.description(),
    }),

    m('.mb3', [
      m('label.mr3', 'Creation Date'),

      m('input.bg-white.bn.montserrat.ocean.outline-0.pa3.p-tint', {
        oninput: m.withAttr('valueAsNumber', v => { Store.created = v }),
        // placeholder: 'Enter title',
        type: 'date',
        // value: Store.created(),
      }),
    ]),
  ])
}

export default Quantity
