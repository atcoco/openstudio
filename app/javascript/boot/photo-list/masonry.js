import { get } from 'services/ajax'
import m from 'mithril'

const bunch = {
  view: vnode => (
    m('.flex.nl3.nr3',
      vnode.attrs.slices.map(slice => (
        m(column, slice.map(x => (
          m(photo, { ...x, key: x.id })
        )))
      ))
    )
  )
}

const column = {
  view: vnode => m('.flex-1', vnode.children)
}

const photo = {
  view: vnode => (
    m('.ba.b--transparent.bw4.dib.w-100',
      m('a.db.ba.b--white.bg-white.bw4.cover.link.overflow-hidden.shadow-q', { href: `${location.pathname}?q=${vnode.attrs.id}` }, [
        m('.relative', [
          m('img', { src: vnode.attrs.url }),

          m('.absolute.absolute--fill.cardo.f2.flex.flex-column.justify-center.hide-child.items-center.white',
            m('.ba.b--white.child.f5.fw4.link.montserrat.mt4.pa3.pointer.white', 'view artwork')
          ),
        ]),

        vnode.attrs.title && m('.b.cardo.f4.mv3.night', vnode.attrs.title),
        vnode.attrs.price && m('.f5.fw5.foam.montserrat.tr', `Prints from $${vnode.attrs.price}`),
      ])
    )
  )
}

const push2slice = (slices, photo) => {
  let idx = 0
  let min = slices[idx].reduce((a, x) => a + x.aspect, 0)
  for (let i = 1; i < 3; i++) {
    let s = slices[i].reduce((a, x) => a + x.aspect, 0)
    if (s < min) {
      idx = i
      min = s
    }
  }
  slices[idx].push(photo)
}

export default vnode => {
  const slices = [ [], [], [] ]

  get(vnode.attrs.url).then(photos => {
    photos.forEach(x => { push2slice(slices, x) })
  })

  return {
    view: () => m('.mv3', m(bunch, { slices }))
  }
}
