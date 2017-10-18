import m from 'mithril'
import Slider from 'components/range-slider'
import { put } from 'services/ajax'
import { PRINTERS, PRICES, SERVICE_FEE, SIZES, SYMBOLS } from 'services/constants'

const button = {
  view: vnode => (
    m('.dib.mb2.mr3.ph4.pointer.pv3', {
      className: vnode.attrs.selected ? 'bg-ocean white' : 'bg-white foam',
      onclick: vnode.attrs.onclick,
    }, vnode.children)
  )
}

const sh = x => `${x}″`

export default vnode => {
  const params = vnode.attrs.params
  const payload = vnode.attrs.payload

  payload.prices.forEach((x, i) => { payload.prices[i] = x ? x : undefined })

  const setPaper = value => () => {
    payload.paper = value
  }

  const setQuantity = value => () => {
    payload.quantity = value
  }

  const toggleSize = idx => () => {
    payload.prices[idx] = payload.prices[idx] === undefined ? 0 : undefined
  }

  const save = () => {
    for (let i = 0; i < SIZES[1].length; i++) {
      let v = payload.prices[i]
      payload.prices[i] = v ? v : 0
    }
    put(params.url, { photo: payload })
      .then(() => { location.reload() })
      .catch(x => { console.error(x) })
    payload.prices.forEach((x, i) => { payload.prices[i] = x ? x : undefined })
  }

  return {
    view: () => {
      const sizes = SIZES[1]
        .map((v, x) => [v, x])
        .filter(x => payload.prices[x[1]] !== undefined)

      return [
        m('label.db.foam.fw5.mb2', 'How many prints do you want in this edition?'),
        m(button, { onclick: setQuantity(3), selected: payload.quantity === 3 }, '3 Prints'),
        m(button, { onclick: setQuantity(10), selected: payload.quantity === 10 }, '10 Prints'),
        m(button, { onclick: setQuantity(20), selected: payload.quantity === 20 }, '20 Prints'),
        m(button, { onclick: setQuantity(30), selected: payload.quantity === 30 }, '30 Prints'),
        m(button, { onclick: setQuantity(-1), selected: payload.quantity === -1 }, 'Open'),

        m('label.db.foam.fw5.mb2.mt4', 'Edition size per format'),
        SIZES[1].map((size, idx) => [
          m(button, { onclick: toggleSize(idx), selected: payload.prices[idx] !== undefined }, sh(size)),
        ]),

        m('label.db.foam.fw5.mb2.mt4', 'Paper type'),
        m(button, { onclick: setPaper(0), selected: payload.paper === 0 }, 'Fine art'),
        m(button, { onclick: setPaper(1), selected: payload.paper === 1 }, 'RC Photo'),

        m('label.db.foam.fw5.mb2.mt4', 'Use a slider to adjust the price'),
        m('.cf.mb4',
          sizes.map(size => m.fragment({ key: size[0] }, [
            m('.evening.f5.fl.mt2.pt3.tc.w-20', SIZES.map((x, i) => [x[size[1]], SYMBOLS[i]].join('')).join(' / ')),
            m('.fl.fw5.ocean.pl3.pr4.pt3.w-80',
              m(Slider, {
                labelFn: x => `$${(x * 1000/100).toFixed()}`,
                onchange: x => payload.prices[size[1]] = Math.round(x * 1000/100),
                value: payload.prices[size[1]] / 10,
              })),
          ]))
        ),
        m('table.collapse.evening.f7.w-100',
          m('tbody', [
            m('tr', { key: 'head' }, [
              m('th.bb.b--tint.relative.smog.tl.w-40', m('.absolute.pr4.top-0.truncate.w-100', PRINTERS[payload.paper])),
              m('th.bb.b--tint.pb1.smog.tl', 'Base price'),
              m('th.bb.b--tint.pb1.smog.tl', 'Service fee'),
              m('th.bb.b--tint.pb1.smog.tl', 'Selling price'),
              m('th.bb.b--tint.pb1.smog.tl', 'Total profit'),
            ]),
            sizes.map(size => (
              m('tr', { key: size[0] }, [
                // m('td.bb.b--tint.pv3', sh(size[0])),
                m('td.bb.b--tint.pv3', SIZES.map((x, i) => [x[size[1]], SYMBOLS[i]].join('')).join(' / ')),
                m('td.bb.b--tint.pv3', `$${PRICES[payload.paper][size[1]].toFixed(2)}`),
                m('td.bb.b--tint.pv3', `$${SERVICE_FEE}`),
                m('td.bb.b--tint.pv3', `$${payload.prices[size[1]]}`),
                m('td.bb.b--tint.pv3', `$${Math.max(payload.prices[size[1]] - SERVICE_FEE - PRICES[payload.paper][size[1]], 0).toFixed(2)}`),
              ])
            ))
          ])
        ),

        m('.flex.items-center.justify-end.mt3', [
          m('a.evening.link.mr4', { href: 'javascript:;', onclick: vnode.attrs.oncancel }, 'Cancel'),
          m('button.ba.bg-transparent.bw1.b--ocean.dib.hover-oceans.link.ocean.pointer.pv3.ph6', { onclick: save }, 'Save')
        ])
      ]
    }
  }
}
