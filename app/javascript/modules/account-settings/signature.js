import m from 'mithril'
import { get, post, put } from 'services/ajax'

const makeImage = file => (
  new Promise((resolve, reject) => {
    let fileReader = new FileReader
    fileReader.onload = () => {
      const img = new Image
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = fileReader.result
    }
    fileReader.readAsDataURL(file)
  })
)

const preview = {
  view: vnode => (
    m('.mv4', [
      m('h3.f3.fw5.evening.ma0.mb3', 'Authenticity Certificate Preview'),
      m('.ba.b--silver.bg-white.evening.pv4.ph5', [
        m('.f1.ocean.tc', [
          m('span.fw3', 'open'),
          m('span.fw5', 'studios'),
        ]),
        m('.f2.cardo.mv3.tc', 'Certificate of Authenticity'),
        m('.f4.mb4', 'Artist'),
        m('.cardo.f4.mb4', [vnode.attrs.user.first_name, vnode.attrs.user.last_name].filter(x => x).join(' ')),
        m('.f4.mb4', 'Title'),
        m('.cardo.f4.mb4', 'Artwork title'),
        m('.flex.justify-between.tc', [
          m('.flex-1', [
            m('.f4.mb4', 'Date created'),
            m('.cardo.f4.mb4', '09/17/2017'),
          ]),
          m('.flex-1', [
            m('.f4.mb4', 'Dimensions'),
            m('.cardo.f4.mb4', '12’’ x 16’’')
          ]),
          m('.flex-1', [
            m('.f4.mb4', 'Limited edition'),
            m('.cardo.f4.mb4', '#1 of #30'),
          ]),
        ]),
        m('img.mv3', { src: vnode.attrs.signature.src, style: { maxWidth: '1500px', maxHeight: '250px'} }),
        m('.f4.i', 'Artist’s signature'),
      ])
    ])
  )
}

export default vnode => {
  let error = ''
  let file = null
  let fileName = ''
  let previewImage = null
  let uploading = false

  let existing = (vnode.attrs.payload.signatures || [])[0]
  if (existing) {
    let img = new Image
    img.onload = () => {
      previewImage = img
      m.redraw()
    }
    img.src = existing
    setTimeout(() => { setError('loading existing signature...') })
  }

  const chooseFile = (e) => {
    let x = e.target.querySelector('input')
    x && x.click()
  }

  const upload = (e) => {
    file = e.target.files[0]
    previewImage = null

    if (file.size > 2097152) {
      return setError('File is too large')
    }

    makeImage(file)
      .then(img => {
        fileName = `${file.name} (${img.width}x${img.height})`
        previewImage = img
        m.redraw()
      })
      .catch(e => {
        console.error(e)
        setError('Unsupported image')
        m.redraw()
      })
  }

  const setError = msg => {
    error = msg
    uploading = false
    file = previewImage = null
    m.redraw()
    setTimeout(() => {
      error = ''
      m.redraw()
    }, 5000)
  }

  const submit = () => {
    uploading = true
    get('/signatures/new', { type: file.type }, { background: true })
      .then(({ payload, url }) => {
        let fd = new FormData
        Object.keys(payload).forEach(k => { fd.append(k, payload[k]) })
        fd.append('file', file)

        console.log(fd, file)

        post(url, fd, { background: true })
          .then(() => {
            put(`/signatures/${payload.key}`)
            setTimeout(() => { location.reload() }, 100)
          })
          .catch(e => {
            console.error(e)
            setError(`failed to upload: ${e.toString()}`)
          })
      })
      .catch(e => {
        console.error(e)
        setError(`failed to init upload: ${e.toString()}`)
      })
  }

  return {
    view: () => [
      m('h2.evening.fw5.ma0.mb3', 'Upload your signature for Authenticity Certificate'),
      m('.f4.mb2.night', 'Every limited edition print comes with an Authenticity Certificate sticked to the back of the print.'),
      m('.f4.mb2.night', 'In order to print those certificates, we require you to upload a digital version of your signature.'),
      m('.f4.mb2.night', 'Ideally signatures should be images of a maximum of 250 pixels height and up to 1500 px width.'),
      m('.f4.mb2.night', 'Upload your file by clicking on «Choose a file» below and we’ll show you a preview of your Authenticity Certificate.'),
      m('.b--tint.bt.bb.flex.items-center.mv5.pv5', [
        m('.ba.bg-transparent.bw1.dib.f4.fw6.hover-oceans.link.pointer.pv3.ph6', {
          className: uploading ? 'b--foam disabled foam' : 'b--ocean ocean',
          onclick: chooseFile
        }, [
          m('input.dn', { type: 'file', onchange: upload }),
          'Choose a file'
        ]),
        m('.ml4', { className: error ? 'red' : 'foam' }, error || fileName || 'File size must be less than 2MB')
      ]),

      previewImage && m(preview, { signature: previewImage, user: vnode.attrs.payload }),

      file && m('.flex.items-center.justify-end.mv5.pv5', [
        m('.foam.mr4', [
          'For more information, please read our ',
          m('a.hover-oceans.link.ocean', { href: '' }, 'Privacy Policy')
        ]),
        m('.ba.bg-transparent.bw1.dib.f4.fw6.hover-oceans.link.pointer.pv3.ph6', {
          className: uploading ? 'b--foam disabled foam' : 'b--ocean ocean',
          onclick: submit
        }, [
          'Submit',
          uploading && m('i.fa.fa-spin.fa-spinner.ml3')
        ])
      ])
    ]
  }
}
