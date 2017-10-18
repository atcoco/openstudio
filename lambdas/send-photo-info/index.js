/*eslint-env node*/
/*eslint no-console: 0*/

const SSL = !!process.env.SSL

const AWS = require('aws-sdk')
const ICC = require('icc')
const HTTP = require(SSL ? 'https' : 'http')
const QS = require('querystring')
const S3 = new AWS.S3
const SHARP = require('sharp')
const UTIL = require('util')

const sendOptions = {
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  hostname: process.env.HOST,
  method: process.env.METHOD || 'PUT',
  port: SSL ? 443 : 80,
}

const download = (s3, next) => {
  S3.getObject({
    Bucket: s3.bucket.name,
    Key: s3.object.key
  }, next)
}

const query = (buffer, next) => {
  SHARP(buffer.Body)
    .metadata()
    .then(meta => {
      const data = {
        space: meta.space
      }
      if (meta.orientation == 6 || meta.orientation == 8) {
        data.width = meta.height
        data.height = meta.width
      } else {
        data.width = meta.width
        data.height = meta.height
      }
      if (meta.icc) {
        const icc = ICC.parse(meta.icc)
        data.ispace = icc.model || icc.colorSpace
        data.idesc = icc.description
      }
      next(null, data)
    })
    .then(null, () => { next({ message: 'Unsupported format' }) })
}

const send = (key, data, next) => {
  data.id = key
  const qs = QS.stringify(data)
  sendOptions.path = `/photos/${key}/meta_callback`
  const http = HTTP.request(sendOptions, response => { response.on('end', next) })
  http.write(qs)
  http.end()
}

exports.handler = function(event, context) {
  const s3 = event.Records[0].s3
  const notify = send.bind(null, s3.object.key)

  require('async').waterfall([
    download.bind(null, s3),
    query,
    notify
  ], (err, result) => {
    notify({ error: err.message }, () => {
      console.log('error: ', UTIL.inspect(err, {depth: 5}))
      context.done(err, result)
    })
  })
}
