const express = require('express')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const registerRouter = require('./router.cjs')

const port = process.env.PORT || 9002

const app = express()

app.use(cookieParser())

app.get('/', function (req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken())
  return next()
})

registerRouter(app)

app.use(compression())

app.use(express.static('./dist'))

// app.use(function (err, req, res, next) {
//   if (err.code !== 'EBADCSRFTOKEN') {
//     return next()
//   }
// })

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Listening at http://localhost:${port}\n`)
})
