import currentUser from 'stores/current-user'
import Store from '../../store'
import m from 'mithril'

const way = {
  view: vnode => m(
    'a.ba.f4.flex.hover-bg-white.hover-ocean.items-center.justify-center.link.mb3.pv3.tc.white',
    { href: 'javascript:;', ...vnode.attrs },
    vnode.children
  )
}

const instagram = {
  onsubmit: e => {
    e.preventDefault()
    Store.setImport('instagram', { username: e.target.handle.value })
    m.route.set('/photos')
  },

  view: () => (
    m('form.flex.flex-column.tc', { onsubmit: instagram.onsubmit }, [
      m('input.ba.b--white.bg-white-20.bw1.f4.mb3.montserrat.pa3.p-white.w-100.white', { name: 'handle', type: 'text', placeholder: 'enter your handle here', value: currentUser.instagram }),

      m('button.ba.b--white.bg-transparent.bw1.f4.flex.hover-bg-white.hover-ocean.items-center.justify-center.link.mb3.pointer.pv3.tc.white', 'Submit')
    ])
  )
}

// const facebook = {
//   view: () => ''
// }

const local = {
  oncreate: () => {
    Store.photo = { height: 1, url: '', width: 1 }
    Store.images = []
    m.route.set('/photo')
  },

  view: () => ''
}

const ImportWays = {
  oninit: function() {
    this.way = ''
    delete Store.images
  },

  view: function() {
    return m('.cf.mh5.mt5', [
      m('h1.cardo.f1.tc.white', 'Where do you primarily share your photos?'),

      m('.fl.w-50.pr4',
        m('.flex.flex-column', [
          m(way, {
            className: this.way === instagram ? 'bg-white ocean' : '',
            onclick: () => { this.way = instagram }
          }, [ m('i.f3.fa.fa-instagram.mr3'), 'instagram' ]),

          // m(way, {
          //   className: this.way === facebook ? 'bg-white ocean' : '',
          //   onclick: () => { this.way = facebook }
          // }, [ m('i.f3.fa.fa-facebook.mr3'), 'facebook' ]),

          m(way, {
            className: this.way === local ? 'bg-white ocean pv3' : 'pv3',
            onclick: () => { this.way = local }
          }, 'My photos are only on my computer'),
        ])
      ),

      m('.fl.w-50.pl4', m(this.way))
    ])
  }
}

export default ImportWays
