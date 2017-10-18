import m from 'mithril'
import Masonry from './masonry'
import FullWidth from './full-height'

const modes = [Masonry, FullWidth]

const Root = vnode => {
  const root = vnode.attrs.root
  const sections = []

  let modeComponent = modes[0]
  let modeParams = { url: root.dataset.photosUrl }
  let sectionIdx = 0

  try {
    JSON.parse(root.dataset.sections).forEach(x => sections.push(x))
  } catch (e) {
    console.error(e)
    // exception handling
  }

  // let currentHeight = document.body.scrollHeight
  // let rootHeight = 0

  return {
    view: () => [
      m('.mv3.tc', [
        sections.map((s, i) => (
          m('a.f4.fw5.link.mh4', {
            className: sectionIdx === i ? 'evening' : 'tint',
            href: 'javascript:;'
          }, s)
        ))]),

      m('.mv3.tr', [
        m('svg.ml3.mode-switch', {
          className: modeComponent === modes[0] ? 'active' : '',
          height: 56,
          onclick: () => { modeComponent = modes[0] },
          viewBox: '0 0 56 56',
          width: 56,
        }, m('g', [
          m('circle', { cx: 28, cy: 28, r: 28 }),
          m('path', {
            d: 'M12 16h10v7H12v-7zm22 0h10v7H34v-7zM23 33h10v7H23v-7zm-11-9h10v16H12V24zm22 0h10v16H34V24zm-11-8h10v16H23V16z',
          })
        ])),

        m('svg.ml3.mode-switch', {
          className: modeComponent === modes[1] ? 'active' : '',
          height: 56,
          onclick: () => { modeComponent = modes[1] },
          viewBox: '0 0 56 56',
          width: 56,
        }, m('g', [
          m('circle', { cx: 28, cy: 28, r: 28 }),
          m('rect', { x: 16, y: 16, width: 24, height: 24, rx: 2 })
        ])),

        // m('svg.ml3.mode-switch', {
        //   className: modeComponent === modes[2] ? 'active' : '',
        //   height: 56,
        //   onclick: () => { modeComponent = modes[2] },
        //   viewBox: '0 0 56 56',
        //   width: 56,
        // }, m('g', [
        //   m('circle', { cx: 28, cy: 28, r: 28 }),
        //   m('text', { 'font-family': 'FontAwesome', 'font-size': '28', 'letter-spacing': '.311' },
        //     m('tspan', { x: 16.344, y: 38 }, '')
        //   )
        // ]))
      ]),

      m(modeComponent, modeParams)
    ]
  }
}

export default function(root) {
  m.mount(root, { view: () => m(Root, { root }) })
}
