import m from 'mithril'

export default {
  view: vnode => (
    m('.bg-white-foam.cover.min-vh-100.ph4.pv3', [
      m('.flex.items-center.justify-center.montserrat.pb4.relative', [
        m('a.absolute.f3.left-0.link.smog', { href: '/' }, [
          m('span.fw3', 'open'),
          m('span.fw6', 'studios'),
        ]),
        m('.relative', [
          m('.b.bg-ocean.br5.ph45.pv3.tracked-mega.ttu.white', [
            m('i.b.fa.fa-check.green.mr2'),
            'Step 1'
          ]),
          m('.absolute.fw4.foam.mt2.nowrap.o-50.tc.tracked-tight.w-100', 'Create Free Account')
        ]),
        m('.relative', [
          m('.b.bg-ocean.br5.mh4.ph45.pv3.tracked-mega.ttu.white', 'Step 2'),
          m('.absolute.fw4.foam.mt2.nowrap.tc.tracked-tight.w-100', 'Upload Your Artwork')
        ]),
        m('.o-50.relative', [
          m('.b.bg-ocean.br5.ph45.pv3.tracked-mega.ttu.white', 'Step 3'),
          m('.absolute.fw4.foam.mt2.nowrap.tc.tracked-tight.w-100', 'Complete Your Profile')
        ])
      ]),
      vnode.children
    ])
  )
}
