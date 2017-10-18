import m from 'mithril'
import ImportWays from './components/imports'
import Photos from './components/photos'
import Photo from './components/photo'
import Store from './store'
import Submit from './components/submit'
import OceanLayout from './layouts/ocean'
import GrayLayout from './layouts/gray'

export default function(rootNode) {
  m.route.prefix('/get-started')
  m.route(rootNode, '', {
    '': {
      render: () => m(OceanLayout, m(ImportWays))
    },
    '/photos': {
      onmatch: () => Store.hasImport ? Photos : m.route.set(''),
      render: (x) => m(GrayLayout, m(x.tag))
    },
    '/photo': {
      onmatch: () => Store.photo ? Photo : m.route.set('/photos'),
      render: (x) => m(GrayLayout, m(x.tag))
    },
    '/submit': {
      onmatch: () => Store.hasInfo ? Submit : m.route.set('/photo'),
      render: (x) => m(GrayLayout, m(x.tag))
    },
  })
}
