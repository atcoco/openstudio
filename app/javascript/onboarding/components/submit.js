import m from 'mithril'
import Store from '../store'

const Submit = {
  view: () => (
    m('.ma5', [
      m('h1.cardo.f1.fw4.mv5.night.tc', 'You’re almost ready to publish your first series!'),

      m('.cf', [
        m('.fl.montserrat.w-50', [
          m('p.f4.lh-title.ocean', 'Our team is reviewing your work before it goes live. We’ll take a look at the work, as well as image resolutions to ensure your work has the highest printing quality. You’ll receive an email when we’re done.'),

          m('p.dark-glow.f5.lh-title.mb4', 'Meanwhile, we strongly recommend that you dive into your profile and dashboard, where you can update your information and account details to get paid.'),

          m('a.ba.bw1.link.b--ocean.f4.fw6.montserrat.ph5.pv3.ocean.tc.db.mb3', {
            href: 'javascript:;',
            onclick: Store.submit
          }, 'Submit and go to your profile now'),

          m('a.ba.bw1.link.b--ocean.f4.fw6.montserrat.ph5.pv3.ocean.tc.db.mb3', {
            href: '',
            oncreate: m.route.link,
          }, 'Or, submit and enter more work'),
        ]),

        m('.fl.w-50.pl3',
          m('.ba.b--white.bg-center.bg-white.bw4.contain.ds.relative.shadow-q', {
            style: { backgroundImage: `url(${Store.photo.url})` }
          }))
      ])
    ])
  )
}

export default Submit
