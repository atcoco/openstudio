import m from 'mithril'
import range from 'components/range-slider'
import Store from '../store'
import { PRICES, SERVICE_FEE } from 'services/constants'

const paper = () => Store.paper === 1 ? 'Fine art paper' : (Store.paper === 2 ? 'Satin RC Photo' : '')

const edition = () => {
  switch (Store.edition) {
  case 1: return 'First edition'
  case 2: return 'Second edition'
  case 3: return 'Third edition'
  }
}

const quantity = () => Store.quantity === -1 ? 'Unlimited prints per size' : (Store.quantity > 0 ? `${Store.quantity} prints per size` : '')

const Price = {
  view: () => m('.mb3', [
    m('.cf.mb4',
      Store.selectedSizeIndexes.map(idx => m.fragment({ key: idx }, [
        m('.evening.f5.fl.mt2.pt3.tc.w-20', Store.sizeHuman(idx)),
        m('.fl.pl3.pr4.pt3.w-80',
          m(range, {
            labelFn: x => `$${(x * 1000/100).toFixed()}`,
            onchange: x => Store.price[idx] = Math.round(x * 1000/100),
            value: Store.price[idx] / 10,
          })),
      ]))
    ),

    m('p.evening.f5.mb4', [paper(), edition(), quantity()].join(' / ')),

    m('table.collapse.evening.f7.w-100',
      m('tbody', [
        m('tr', { key: 'head' }, [
          m('th.bb.b--tint'),
          m('th.bb.b--tint.pb1.tl', 'Base price'),
          m('th.bb.b--tint.pb1.tl', 'Service fee'),
          m('th.bb.b--tint.pb1.tl', 'Selling price'),
          m('th.bb.b--tint.pb1.tl', 'Total profit'),
        ]),
        Store.selectedSizeIndexes.map(idx => (
          m('tr', { key: idx }, [
            m('td.bb.b--tint.pv3', Store.sizePairHuman(idx).join(' / ')),
            m('td.bb.b--tint.pv3', `$${PRICES[Store.paper][idx].toFixed(2)}`),
            m('td.bb.b--tint.pv3', `$${SERVICE_FEE}`),
            m('td.bb.b--tint.pv3', `$${Store.price[idx]}`),
            m('td.bb.b--tint.pv3', `$${Math.max(Store.price[idx] - SERVICE_FEE - PRICES[Store.paper][idx], 0).toFixed(2)}`),
          ])
        ))
      ])
    )
  ])
}

export default Price
