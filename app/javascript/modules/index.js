import AccountSettings from './account-settings'
import BioForm from './bio-form'
import PhotoForm from './photo-form'
import { get } from 'services/ajax'
import m from 'mithril'

const normalizeSelector = x => {
  if (typeof x !== 'string') return null
  if (x[0] == '.') return x.replace(/^\.js-/, '.')
  if (x[0] == '#') return x
  return `#${x}`
}

const list = {
  'account-settings': AccountSettings,
  'bio-form': BioForm,
  'photo-form': PhotoForm,
}

const mount = params => {
  let component = list[params.remote]
  let sel = normalizeSelector(params.target || params.remote)
  let root = document.querySelector(sel)

  if (!root) return
  m.render(root, m('i.fa.fa-spin.fa-spinner'))

  if (params.url) {
    get(params.url)
      .then(payload => {
        m.mount(root, {
          view: () => m(component, { payload, params, root })
        })
      })
      .catch(err => { console.error(err) })
  }
}

export const handleClick = event => {
  const node = event.target, data = node.dataset
  if (list[data.remote]) {
    event.preventDefault()
    event.stopPropagation()
    mount({ ...data, trigger: node })
  }
}

export const handleLocation = () => {
  const key = location.hash.substr(1)
  if (list[key]) {
    mount({ remote: key })
  }
}
