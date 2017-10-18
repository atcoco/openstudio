import { get } from 'services/ajax'
import m from 'mithril'

const photo = {
  view: vnode => (
    m('.ba.b--transparent.bw4.dib.w-100',
      m('a.db.ba.b--white.bg-white.bw4.cover.link.overflow-hidden.shadow-q', { href: `${location.pathname}?q=${vnode.attrs.id}` }, [
        m('.relative.tc', [
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

export default vnode => {
  let photos = []

  get(vnode.attrs.url, { width: 'full' }).then(x => { photos = x })

  return {
    view: () => m('.mv3', photos.map(x => m(photo, { ...x, key: x.id })))
  }
}
