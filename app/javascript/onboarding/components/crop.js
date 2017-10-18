import Croppr from 'croppr'
import m from 'mithril'
import Store from '../store'

const update = (vnode, instance, value) => {
  let w = instance.imageEl.offsetWidth
  let h = instance.imageEl.offsetHeight
  Store.crops[vnode.attrs.id] = {
    x: Math.floor(100 * 100 * value.x / w) / 100,
    y: Math.floor(100 * 100 * value.y / h) / 100,
    w: Math.floor(100 * 100 * value.width / w) / 100,
    h: Math.floor(100 * 100 * value.height / h) / 100,
  }
  m.redraw()
}

const cropper = {
  oncreate: vnode => {
    let c = new Croppr(vnode.dom, {
      aspectRatio: vnode.attrs.aspect,
      minSize: [50, 50, '%'],
      onInitialize: i => { setTimeout(() => { update(vnode, c, i.getValue('raw')) }, 100) },
      onUpdate: v => { update(vnode, c, v) },
      returnMode: 'raw',
      startSize: [100, 100, '%'],
    })
  },

  view: () => (
    m('img', { src: Store.photo.url })
  )
}

const Crop = {
  view: () => (
    m('.mb3', [
      m('p.evening.f5', 'Modify your image to adjust how you want your artwork to display across the site.'),
      m('.bg-chess.mt3.w-100', m(cropper, { aspect: 1, id: 'square', key: 'square' })),
      m('.bg-chess.mt3.w-100', m(cropper, { aspect: 9/16, id: 'wide', key: 'wide' })),
    ])
  )
}

export default Crop
