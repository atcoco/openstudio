/*eslint-env node*/
/*eslint no-console: 0*/

const Sharp = require('sharp')
// const Icc = require('icc')
// const path = require('path')

const filename = process.argv[2]
const image = Sharp(filename)
// image
//   .metadata()
//   .then(meta => {
//     let data = {
//       width: meta.width,
//       height: meta.height,
//       space: meta.space
//     }
//     if (meta.icc) {
//       const icc = Icc.parse(meta.icc)
//       data.profile = { space: icc.model || icc.colorSpace, info: icc.description }
//     }
//     const preview = path.join(path.dirname(filename), 'preview.jpg')
//     image.resize(1080, 1080).max().withoutEnlargement().jpeg().toFile(preview).then(() => {
//       console.log(JSON.stringify(data))
//     }).catch(error => {
//       console.log(JSON.stringify({ error: error.message }))
//     })
//   })
//   .catch(error => {
//     console.log(JSON.stringify({ error: error.message }))
//   })

const payload = process.argv[3].split('-') //rbNVSQIl2Kux3AVu+I8+Zq5+JJjn/5czGBE+065J
// const key = payload.slice(1, 6).join('-')
const job = payload.slice(6).map(x => parseFloat(x))
const resize = job.slice(0, 2)
const crop = job.slice(2, 6)

let img = image
img.metadata().then(info => {
  img = img.rotate()

  if (crop[0] || crop[1]) {
    console.log(info)
    if (info.orientation == 6 || info.orientation == 8) {
      let x = info.width
      info.width = info.height
      info.height = x
    }
    let d = 100 - crop[0]
    if (crop[2] > d) { crop[2] = d }
    d = 100 - crop[1]
    if (crop[3] > d) { crop[3] = d }
    console.log(crop)
    let c = {
      height: Math.floor(crop[1] * info.height / 100),
      left: Math.floor(crop[2] * info.width / 100),
      top: Math.floor(crop[3] * info.height / 100),
      width: Math.floor(crop[0] * info.width / 100),
    }
    console.info(crop, c)
    img = img.extract(c)
    info.width = c.width
    info.height = c.height
  }

  img
    .resize(resize[0], resize[1])
    .max().withoutEnlargement()
    .jpeg()
    .withMetadata()
    .toFile('q.jpg')
})
