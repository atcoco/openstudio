import m from 'mithril'
import { del, get, put } from 'services/ajax'

const input = {
  view: vnode => [
    m('input.bg-white.bn.fw4.montserrat.ocean.outline-0.pa3.p-foam.w-100', {
      oninput: m.withAttr('value', vnode.attrs.oninput),
      placeholder: vnode.attrs.placeholder,
      readonly: !!vnode.attrs.readonly,
      type: 'text',
      value: vnode.attrs.value
    }),

    Array.isArray(vnode.attrs.errors) ? m('.red.mt2', vnode.attrs.errors.join(', ')) : null,
  ]
}

export default vnode => {
  const params = vnode.attrs.params
  const payload = vnode.attrs.payload
  var errors = {}

  const cancel = () => {
    m.mount(vnode.attrs.root, null)
  }

  const onsubmit = event => {
    event.preventDefault()
    put(params.url, { user: payload })
      .then(x => { window.location = x.url })
      .catch(x => { errors = { ...x } })
  }

  const connectFacebook = () => {
    const fn = uid => {
      put('/dashboard/link', { type: 'facebook', uid })
        .then(x => payload.social = x.social)
        .catch(x => console.error(x))
    }
    top.FB.getLoginStatus(fb => {
      if (fb.status === 'connected') {
        fn(fb.authResponse.userID)
      } else {
        top.FB.login(response => {
          if (response.authResponse) {
            fn(fb.authResponse.userID)
          }
        }, 'email, public_profile')
      }
    })
  }

  const disconnectFacebook = () => {
    del('/users/auth/facebook')
      .then(() => {
        get(params.url)
          .then(x => { Object.assign(payload, x) })
          .catch(x => { console.errors(x) })
      })
      .catch(x => { console.error(x) })
  }

  return {
    view: () => (
      m('form.cf', { onsubmit }, [
        m('.fl.mb3.pr2.w-50',
          m(input, {
            errors: errors.first_name,
            oninput: x => { payload.first_name = x },
            placeholder: 'First name',
            value: payload.first_name,
          })
        ),

        m('.fl.mb3.pl2.w-50',
          m(input, {
            errors: errors.last_name,
            oninput: x => { payload.last_name = x },
            placeholder: 'Last name',
            value: payload.last_name,
          })
        ),

        m('.fl.mb3.pr2.w-50',
          m(input, {
            errors: errors.email,
            oninput: x => { payload.email = x },
            placeholder: 'Email',
            readonly: true,
            value: payload.email,
          })
        ),

        m('.fl.mb3.pl2.w-50',
          m('label.db.flex.foam.fw4.items-center.pv3', [
            m('input.bn.mr2', {
              checked: !!payload.subscribed,
              onclick: () => { payload.subscribed = !payload.subscribed },
              type: 'checkbox'
            }),
            m('span', 'Subscribe to our newsletter'),
          ])
        ),

        m('.cl.mb4.w-100', [
          m(input, {
            errors: errors.username,
            oninput: x => { payload.username = x },
            placeholder: 'Choose your custom URL and member name (alpha-numeric characters only)',
            value: payload.username,
          }),
          m('.foam.fw5.monserrat.mt3', [
            m('span.mr2', 'Your URL will look like this:'),
            `https://www.openstudios.in/${payload.username}`
          ])
        ]),

        m('.cf',
          m('.fl.pr2.w-50',
            m(input, {
              errors: errors.country,
              oninput: x => { payload.country = x },
              placeholder: 'Country',
              value: payload.country,
            })
          )),

        m('h2.evening.fw5.mt5', 'Linked accounts'),

        m('.dark-glow.flex.items-center', [
          m('i.blue-fb.f2.fa.fa-facebook-official'),
          payload.social.indexOf('facebook') === -1
            ? m('a.dark-glow.fw4.hover-evening.link.ml3', { href: 'javascript:;', onclick: connectFacebook }, 'Connect to Facebook')
            : [
              m('.fw4.mh2', 'You’re connected to Facebook'),
              m('a.fw5.link.ocean', { href: 'javascript:;', onclick: disconnectFacebook }, 'Logout')
            ]
        ]),

        m('.cl.flex.items-center.justify-end.mt3', [
          m('a.evening.link.mr4', { href: 'javascript:;', onclick: cancel }, 'Cancel'),
          m('button.ba.bg-transparent.bw1.b--ocean.dib.hover-oceans.link.ocean.pointer.pv3.ph6', 'Save')
        ])
      ])
    ),
  }
}
