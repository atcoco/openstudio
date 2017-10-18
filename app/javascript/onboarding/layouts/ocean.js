import m from 'mithril'

export default {
  view: vnode => (
    m('.bg-ocean.cover.min-vh-100.ph4.pv3', [
      m('.flex.items-center.justify-center.montserrat.pb4.relative', [
        m('a.absolute.f3.left-0.link.white', { href: '/' }, [
          m('span.fw3', 'open'),
          m('span.fw6', 'studios'),
        ]),
        m('.relative', [
          m('.b.bg-white.br5.ocean.ph45.pv3.tracked-mega.ttu', [
            m('i.b.fa.fa-check.green.mr2'),
            'Step 1'
          ]),
          m('.absolute.b.mt2.nowrap.o-50.tc.tracked-tight.w-100.white', 'Create Free Account')
        ]),
        m('.relative', [
          m('.b.bg-white.br5.mh4.ocean.ph45.pv3.tracked-mega.ttu', 'Step 2'),
          m('.absolute.b.mt2.nowrap.tc.tracked-tight.w-100.white', 'Upload Your Artwork')
        ]),
        m('.o-50.relative', [
          m('.b.bg-white.br5.ocean.ph45.pv3.tracked-mega.ttu', 'Step 3'),
          m('.absolute.b.mt2.nowrap.tc.tracked-tight.w-100.white', 'Complete Your Profile')
        ])
      ]),
      vnode.children
    ])
  )
}
