import m from 'mithril'
import { put } from 'services/ajax'

export default vnode => {
  const params = vnode.attrs.params
  const payload = vnode.attrs.payload
  var errors = {}

  const onsubmit = event => {
    event.preventDefault()

    put(params.url, {
      photo: {
        created: payload.created,
        description: payload.description,
        title: payload.title
      }
    })
      .then(() => { location.reload() })
      .catch(x => { errors = x })
  }

  return {
    view: () => (
      m('form', { onsubmit }, [
        m('.mb3', [
          m('input.bg-white.bn.fw4.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
            oninput: m.withAttr('value', x => { payload.title = x }),
            placeholder: 'Photo title',
            type: 'text',
            value: payload.title
          }),

          Array.isArray(errors.title) ? m('.red.mt2', errors.title.join(', ')) : null,
        ]),

        m('.mb3', [
          m('textarea.bg-white.bn.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
            oninput: m.withAttr('value', x => { payload.description = x }),
            placeholder: 'Photo description',
            rows: 10,
            value: payload.description,
          }),

          Array.isArray(errors.description) ? m('.red.mt2', errors.description.join(', ')) : null,
        ]),

        m('.mb3', [
          m('label.mr3', 'Creation date'),

          m('input.bg-white.bn.fw4.montserrat.ocean.outline-0.pa3.p-foam', {
            oninput: m.withAttr('valueAsNumber', x => { payload.created = x }),
            type: 'date',
            valueAsNumber: payload.created === 0 ? undefined : payload.created
          }),

          Array.isArray(errors.title) ? m('.red.mt2', errors.title.join(', ')) : null,
        ]),

        m('.flex.items-center.justify-end.mt3', [
          m('a.evening.link.mr4', { href: 'javascript:;', onclick: vnode.attrs.oncancel }, 'Cancel'),
          m('button.ba.bg-transparent.bw1.b--ocean.dib.hover-oceans.link.ocean.pointer.pv3.ph6', 'Save')
        ])
      ])
    )
  }
}
