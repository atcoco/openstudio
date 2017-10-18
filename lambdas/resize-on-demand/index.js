/*eslint-env node*/
/*eslint no-console: 0*/

const AWS = require('aws-sdk')
const S3 = new AWS.S3()
const Sharp = require('sharp')
const Crypto = require('crypto')

const BUCKET = process.env.BUCKET
const SIGNATURE = process.env.SIGNATURE

const is_signature_valid = x => {
  const payload = x.slice(1).join('-')
  const signature = Crypto.createHash('md5').update(payload + SIGNATURE).digest('hex')
  // console.log('calculated signature', signature)
  return signature === x[0]
}

const finish = (context, buffer) => {
  context.succeed({
    body: buffer.toString('base64'),
    headers: {
      'Cache-Control': 'max-age=1314000, public',
      'Content-Type': 'image/jpeg'
    },
    isBase64Encoded: true,
    statusCode: 200
  })
}

exports.handler = function(event, context, callback) {
  const request = event.path.split('/')[1]
  const decoded = new Buffer(request, 'base64').toString('ascii')
  const payload = decoded.split('-')

  if (!is_signature_valid(payload)) {
    return callback(new Error('invalid request'))
  }

  const key = payload.slice(1, 6).join('-')
  const job = payload.slice(6).map(x => parseFloat(x))
  const resize = job.slice(0, 2)
  const crop = job.slice(2, 6)

  S3.getObject({Bucket: BUCKET, Key: key}).promise()
    .then(s3 => {
      let img = Sharp(s3.Body)
      img.metadata().then(info => {
        img = img.rotate()

        if (crop[0] || crop[1]) {
          if (info.orientation == 6 || info.orientation == 8) {
            let x = info.width
            info.width = info.height
            info.height = x
          }
          // check bounds
          let d = 100 - crop[0]
          if (crop[2] > d) { crop[2] = d }
          d = 100 - crop[1]
          if (crop[3] > d) { crop[3] = d }
          // prepare crop
          let c = {
            height: Math.round(crop[1] * info.height / 100),
            left: Math.round(crop[2] * info.width / 100),
            top: Math.round(crop[3] * info.height / 100),
            width: Math.round(crop[0] * info.width / 100),
          }
          // console.info(crop, c)
          img = img.extract(c)
          info.width = c.width
          info.height = c.height
        }

        img
          .resize(resize[0], resize[1])
          .max().withoutEnlargement()
          .jpeg()
          .withMetadata()
          .toBuffer()
          .then(b => { finish(context, b) })
          .catch(err => callback(err))
      })
    })
    .catch(err => callback(err))
}
