import m from 'mithril'
import stream from 'mithril/stream'
import { put } from 'services/ajax'

export default class Form {
  constructor(vnode) {
    this.bio = stream(vnode.attrs.payload.bio || '')
    this.edu = stream(vnode.attrs.payload.education || '')
    this.born = stream(vnode.attrs.payload.born || '')
    this.params = vnode.attrs.params
    this.errors = {}
    this.root = vnode.attrs.root
    this.params.trigger.classList.add('disabled')
    this.params.trigger.classList.add('o-30')
  }

  cancel() {
    this.params.trigger.classList.remove('disabled')
    this.params.trigger.classList.remove('o-30')
    m.mount(this.root, null)
  }

  onsubmit(event) {
    event.preventDefault()
    put(this.params.url, {
      user: {
        bio: this.bio(),
        born: this.born(),
        education: this.edu()
      }
    }).then(() => {
      location.reload()
    }).catch(err => {
      this.errors = err
    })
  }

  view() {
    return m('form.pv4', { onsubmit: e => { this.onsubmit(e) } }, [
      m('textarea.bg-white.bn.mb3.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
        name: 'bio',
        oninput: m.withAttr('value', this.bio),
        placeholder: 'Artist bio',
        rows: 10,
        value: this.bio(),
      }),

      Array.isArray(this.errors.bio) ? m('.red.mt2', this.errors.bio.join(', ')) : null,

      m('input.bg-white.bn.mb3.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
        name: 'education',
        oninput: m.withAttr('value', this.edu),
        placeholder: 'Education',
        type: 'text',
        value: this.edu()
      }),

      Array.isArray(this.errors.education) ? m('.red.mt2', this.errors.education.join(', ')) : null,

      m('input.bg-white.bn.mb3.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
        max: 2015,
        min: 1900,
        name: 'born',
        oninput: m.withAttr('value', this.born),
        placeholder: 'Born',
        type: 'number',
        value: this.born()
      }),

      Array.isArray(this.errors.born) ? m('.red.mt2', this.errors.born.join(', ')) : null,

      m('.flex.items-center.justify-end.mt3', [
        m('a.evening.link.mr4', { href: 'javascript:;', onclick: this.cancel.bind(this) }, 'Cancel'),
        m('button.ba.bg-transparent.bw1.b--ocean.dib.hover-oceans.link.ocean.pointer.pv3.ph6', 'Save')
      ])
    ])
  }
}
