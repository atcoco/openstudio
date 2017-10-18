import m from 'mithril'
import Store from '../store'
import uploadFile from 'services/upload'

var uploading = false

const upload = node => {
  uploading = true
  uploadFile(node.files[0])
    .then(x => {
      Store.photo = x
      uploading = false
      m.redraw()
    })
    .catch(x => {
      Store.photo.error = x
      uploading = false
      m.redraw()
    })
}

const maxSize = () => {
  let sizes = Store.availableSizes()
  let last = sizes.length > 0 ? sizes[sizes.length - 1] : null
  return last ? `up to ${last} ${Store.dimensionPlural}` : 'too small'
}

const profile = () => {
  if (Store.photo.error) {
    return m('span.ml2.red', `${Store.photo.error}`)
  } else if (Store.photo.profile) {
    return m('span.ml2', `${Store.photo.profile} (${Store.photo.space})`)
  } else {
    let space = Store.photo.space || 'srgb'
    return m('span.ml2.red', `${space.toUpperCase()} without profile`)
  }
}

const Upload = {
  view: () => (
    m('.mb4', [
      m('label.db.foam.mb2', 'Upload a high resolution image now'),
      m('a.ba.bw1.db.link.b--ocean.f4.fw4.mb3.montserrat.ocean.pv3.relative.tc',
        {
          href: 'javascript:;',
          onclick: (e) => e.target.parentNode.querySelector('input').click()
        },
        [
          m('input.dn[type="file"]', { onchange: (e) => upload(e.target) }),
          'Upload',
          m('i.absolute.fa.right-1', { className: uploading ? 'fa-spin fa-spinner' : 'fa-upload' })
        ]
      ),

      m('.evening.f6.mb2', [
        m('span', 'Image resolution check:'),
        m('span.ml2', maxSize()),
      ]),

      m('.evening.f6.mb2', [
        m('span', 'ICC profile check:'),
        profile(),
        m('a.ml2.ocean', { href: 'javascript:;' }, 'Read more about profile requirements'),
      ])
    ])
  )
}

export default Upload
