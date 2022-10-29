import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import registerRouter from './router.js'

const port = process.env.PORT || 9002

const app = express()

app.use(cookieParser())

app.get('/', function (req, res, next) {
//  res.cookie('XSRF-TOKEN', req.csrfToken())
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

export default app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log(`Listening at http://localhost:${port}\n`)
})
