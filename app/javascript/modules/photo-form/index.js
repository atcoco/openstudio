import m from 'mithril'
import infoView from './info'
import pricingView from './pricing'

const toggleSiblings = enabled => {
  Array.prototype.forEach.call(document.querySelectorAll('.photo-wrapper'), x => {
    enabled ? x.classList.add('o-30') : x.classList.remove('o-30')
  })
}

export default vnode => {
  let showPricing = false

  const params = vnode.attrs.params
  const payload = vnode.attrs.payload

  toggleSiblings(true)
  let triggerParent = params.trigger.closest('.photo-wrapper')
  triggerParent.classList.remove('o-30')

  const cancel = () => {
    toggleSiblings(false)
    m.mount(vnode.attrs.root, null)
  }

  return {
    view: () => (
      m('.mv5', [
        m('a.b.dib.link.mb4.mr4', {
          className: showPricing ? 'foam' : 'ocean',
          href: 'javascript:;',
          onclick: () => { showPricing = !showPricing },
        }, 'Photo Info'),

        m('a.b.dib.link.mb4.mr4', {
          className: showPricing ? 'ocean' : 'foam',
          href: 'javascript:;',
          onclick: () => { showPricing = !showPricing },
        }, 'Pricing'),

        m(showPricing ? pricingView : infoView, { params, payload, oncancel: cancel }),
      ])
    )
  }
}
