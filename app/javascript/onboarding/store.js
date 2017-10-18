import { get, post } from 'services/ajax'
import stream from 'mithril/stream'
import { PRICES, SERVICE_FEE } from 'services/constants'

const DPI = 100

const FORMATS = [
  {
    name: 'in',
    plural: 'inches',
    short: '″',
  },
  {
    name: 'cm',
    plural: 'centimeters',
    short: 'cm',
  },
]

const SIZES = [
  [ '8x12', '12x16', '16x24', '24x36', '30x45', '40x60' ],
  [ '20x30', '30x40', '40x60', '60x90', '75x115', '100x150' ],
]

const imports = {
  instagram: ({ username }) => (
    get('/get-started/imports/instagram', { handle: username }, { background: true })
      .then(x => store.images = x)
  ),

  local: () => {
    store.photo = { height: 1, url: '', width: 1 }
  }
}

const PAPERS = ['Fine Art', 'RC Photo']

const currentDimension = stream(0)
const selectedPhoto = stream(undefined)

const maxSizeIndex = selectedPhoto.map(photo => {
  if (photo) {
    let idx = -1
    SIZES[0].forEach((s, i) => {
      let [w, h] = s.split('x').map(x => parseInt(x))
      if (photo.width >= w * DPI && photo.height >= h * DPI) {
        idx = i
      } else {
        let x = store.selectedSizeIndexes.indexOf(i)
        x !== -1 && store.selectedSizeIndexes.splice(x, 1)
      }
    })
    return idx
  } else {
    return -1
  }
})

const store = {
  edition: undefined,
  quantity: undefined,
  paper: undefined,

  created: 0,
  title: stream(''),
  description: stream(''),
  keywords: [],

  crops: {},

  selectedSizeIndexes: [],

  price: {},

  allSizes: currentDimension.map(x => SIZES[x]),

  get availableSizes() { return maxSizeIndex.map(max => SIZES[currentDimension()].filter((_, i) => i <= max)) },

  get dimensionPlural() { return FORMATS[currentDimension()].plural },

  get format() { return FORMATS[currentDimension()] },
  get formats() { return FORMATS },
  get maxSizeIndex() { return maxSizeIndex() },

  get dimension() { return FORMATS[currentDimension()].name },
  set dimension(v) {
    let idx = FORMATS.findIndex(x => x.name === v)
    currentDimension(idx)
  },

  get selectedSizes() { return store.allSizes().filter((_, i) => store.selectedSizeIndexes.indexOf(i) !== -1) },

  sizeHuman: idx => `${SIZES[currentDimension()][idx]}${FORMATS[currentDimension()].short}`,
  sizePairHuman: idx => FORMATS.map((f, i) => `${SIZES[i][idx]}${f.short}`),

  toggleSize: idx => {
    let x = store.selectedSizeIndexes.indexOf(idx)
    if (x === -1) {
      store.selectedSizeIndexes.push(idx)
      store.price[idx] || (store.price[idx] = 0)
    } else {
      delete store.price[idx]
      store.selectedSizeIndexes.splice(x, 1)
    }
    store.selectedSizeIndexes.sort()
  },

  moneyString: v => v.toLocaleString('en', { currency: 'USD', style: 'currency' }),

  get costEstimate() {
    let slice = PRICES[store.paper]
    if (Array.isArray(slice)) {
      return slice.reduce((a, x, i) => a + Math.max((store.price[i] || 0) - x - SERVICE_FEE, 0), 0)
    } else {
      return 0
    }
  },

  get hasEditionAndQuantity() { return store.edition !== undefined && store.quantity !== undefined },
  get hasPaper() { return store.paper !== undefined },
  get hasSizes() { return store.selectedSizeIndexes.length > 0 },
  get hasImport() { return typeof store.import === 'function' },
  get hasPrice() { return store.selectedSizeIndexes.length > 0 && store.selectedSizeIndexes.every(x => store.price[x] > 0) },
  get hasInfo() { return store.title().length > 0 && store.description().length > 0 && store.created > 0 },
  get hasCrop() { return !!store.crops.square && !!store.crops.wide },

  get photo() { return selectedPhoto() },
  set photo(x) { selectedPhoto(x) },

  get paperHuman() { return PAPERS[store.paper] },

  setImport: function(type, payload) {
    delete store.images
    selectedPhoto(undefined)
    store.import = imports[type].bind(null, payload)
  },

  submit: () => {
    let price = []
    Object.keys(store.price).forEach(k => {
      price[k] = store.price[k]
    })
    for (let i = 0; i < price.length; i++) { price[i] = price[i] || 0 }

    post(location.pathname, {
      created: store.created,
      crop: store.crops,
      description: store.description(),
      edition: store.edition,
      height: store.photo.height,
      id: store.photo.id,
      price: price,
      quantity: store.quantity,
      title: store.title(),
      paper: store.paper,
      width: store.photo.width,
    }).then(x => window.location = x.location)
  }
}

export default store
