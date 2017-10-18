import Crop from './crop'
import Edition from './edition'
import Info from './info'
import m from 'mithril'
import Paper from './paper'
import Price from './price'
import Quantity from './quantity'
import Sizes from './size'
import Store from '../store'
import Upload from './upload'

const feature = {
  view: vnode => (
    m('.bg-white.br5.dib.min-w7.mr2.mt2.ph3.pv2.shadow-q.tc', vnode.children)
  )
}

const editions = { 1: '1st', 2: '2nd', 3: '3rd' }

const costEstimate = () => {
  let x = Store.costEstimate
  if (x > 0) {
    return m('.absolute.absolute--fill.flex.flex-column.items-center.justify-center.white', [
      m('.b.f4', 'Estimated gross sale'),
      m('.cardo.b.f0', Store.moneyString(x)),
      m('.f7.mt2', '* if all limited edition photos sell out'),
    ])
  } else {
    return null
  }
}

const preview = {
  view: () => [
    m('.ba.b--white.bg-center.bg-white.bw4.contain.ds.relative.shadow-q', {
      style: { backgroundImage: `url(${Store.photo.url})` }
    }, m('.absolute.absolute--fill.evening.f7.ma3.montserrat.mt3', [
      Store.edition !== undefined ? m(feature, `${editions[Store.edition]} Edition`) : null,
      Store.quantity !== undefined ? m(feature, Store.quantity > 0 ? `${Store.quantity} Prints` : 'Unlimited Prints') : null,
      Store.selectedSizeIndexes.map(idx => m(feature, Store.sizeHuman(idx))),
      Store.paper !== undefined ? m(feature, Store.paperHuman) : null,
      costEstimate(),
    ]))
  ]
}

const group = {
  stateClasses: vnode => (
    [
      (vnode.attrs.accessible || vnode.attrs.done) ? 'pointer' : 'o-30',
      vnode.attrs.expanded ? 'expanded' : '',
      vnode.attrs.separator === false ? '' : 'bt b--tint',
    ].filter(x => x).join(' ')
  ),

  view: vnode => {
    let a = vnode.attrs
    return [
      m('dt.f3.flex.items-center.justify-between.pv3', {
        className: group.stateClasses(vnode),
        onclick: a.accessible ? a.toggleCollapse : null,
      }, [
        m('span', [
          a.done ? m('i.fa.fa-check-circle.mr2.spring') : null,
          a.title,
        ]),
        m('i.f5.fa', { class: a.expanded ? 'fa-chevron-up' : 'fa-chevron-down' })
      ]),

      a.expanded ? m('dd.ma0.overflow-hidden.pb4.pt2',
        { className: vnode.attrs.expanded ? '' : 'dn' },
        vnode.children
      ) : null
    ]
  }
}

const Photo = {
  oninit: vnode => {
    Array.isArray(Store.images) || Store.import().then(() => { m.redraw() })
    vnode.state.expanded = 0
  },

  toggleCollapse: (vnode, idx) => {
    if (vnode.state.expanded === idx) {
      vnode.state.expanded = null
    } else {
      vnode.state.expanded = idx
    }
  },

  view: vnode => (
    m('.ma5', [
      m('h1.cardo.f1.fw4.mv5.night.tc', 'Fill out the details below and get your image ready to sell.'),

      m('.evening.f6.montserrat.mv4', [
        m('strong', 'pro tip:'),
        ' pick a photo that you known has done well on you facebook or instagram account'
      ]),

      m('.cf', [
        m('.fl-ns.flex.flex-wrap.justify-between.montserrat.w-50-ns',
          m('dl.db.ma0.ocean.w-100', [
            m(group, {
              accessible: true,
              done: Store.hasEditionAndQuantity,
              expanded: vnode.state.expanded === 0,
              separator: false,
              title: 'Set edition and quantity',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 0),
            }, [
              m(Edition),
              m(Quantity),
            ]),

            m(group, {
              accessible: true,
              done: Store.hasSizes,
              expanded: vnode.state.expanded === 1,
              title: 'Select format and upload photo',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 1),
            }, [
              m(Upload),
              m(Sizes),
            ]),

            m(group, {
              accessible: Store.hasSizes,
              done: Store.hasPaper,
              expanded: vnode.state.expanded === 2,
              title: 'Select your paper type',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 2),
            }, [
              m(Paper)
            ]),

            m(group, {
              accessible: Store.hasEditionAndQuantity && Store.hasSizes && Store.hasPaper,
              done: Store.hasPrice,
              expanded: vnode.state.expanded === 3,
              title: 'Price your work',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 3),
            }, [
              m(Price)
            ]),

            m(group, {
              accessible: Store.hasPrice,
              done: Store.hasInfo,
              expanded: vnode.state.expanded === 4,
              title: 'Enter title and description',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 4),
            }, [
              m(Info)
            ]),

            m(group, {
              accessible: Store.hasInfo,
              done: Store.hasCrop,
              expanded: vnode.state.expanded === 5,
              title: 'Choose artwork format to display on site',
              toggleCollapse: Photo.toggleCollapse.bind(null, vnode, 5),
            }, [
              m(Crop)
            ]),
          ])
        ),

        m('.fl-ns.w-50-ns.pl4-ns', [
          m(preview),
          m('a.ba.bw1.link.b--ocean.f4.fw6.montserrat.ph5.pv3.ocean.tc.db.mt3', {
            className: Store.hasEditionAndQuantity && Store.hasSizes && Store.hasPaper && Store.hasPrice && Store.hasInfo && Store.hasCrop ? '' : 'disabled o-30',
            href: '/submit',
            oncreate: m.route.link,
          }, 'Continue')
        ])
      ])
    ])
  )
}

export default Photo
