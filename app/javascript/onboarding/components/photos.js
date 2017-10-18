import m from 'mithril'
import Store from '../store'

var selection = null

const preview = {
  view: () => (
    [
      m('.ba.b--white.bg-center.bw4.contain.ds.shadow-q', { style: { backgroundImage: `url(${selection.url})` } }),
      m('a.ba.bw1.link.b--ocean.f4.fw6.montserrat.ph5.pv3.ocean.tc.db.mt3', {
        href: '/photo',
        oncreate: m.route.link
      }, 'Proceed with this image')
    ]
  )
}

const list = {
  select: img => {
    Store.photo = img
    selection = img
  },

  view: () => (
    m('.cf', [
      m('.fl-ns.flex.flex-wrap.justify-between.w-50-ns',
        Store.images.map(img => (
          m('.mb-3p.overflow-hidden.shadow-q.w-48', { key: img.id },
            m('.ba.bg-center.bw3.cover.ds-80', {
              className: Store.selected === img ? 'b--ocean' : 'b--white',
              onclick: list.select.bind(null, img),
              style: { backgroundImage: `url(${img.thumb})` }
            }))
        ))),

      m('.fl-ns.w-50-ns.pl3-ns', selection && m(preview))
    ])
  )
}

const Photos = {
  oninit: () => {
    Array.isArray(Store.images) || Store.import().then(() => { m.redraw() })
  },

  view: () => (
    m('.ma5', [
      m('h1.cardo.f1.fw4.mv5.night.tc', 'Pick the image you want to start selling.'),

      m('.evening.f6.montserrat.mv4', [
        m('strong', 'pro tip:'),
        ' pick a photo that you known has done well on you facebook or instagram account'
      ]),

      Array.isArray(Store.images) ? m(list) : 'Loading, please wait a little bit...'
    ])
  )
}

export default Photos
