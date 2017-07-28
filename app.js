require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const { pathOr, keys, path } = require('ramda')

const dal = require(`./${process.env.DAL}`)

const bodyParser = require('body-parser')

const checkReqdFields = require('./lib/check-reqd-fields')
const checkPaintingReqdFields = checkReqdFields([
  `name`,
  `movement`,
  `artist`,
  `yearCreated`,
  `museumName`,
  `museumLocation`
])

const checkUpdatedPaintingReqdFields = checkReqdFields([
  `_id`,
  `_rev`,
  `name`,
  `movement`,
  `artist`,
  `yearCreated`,
  `museumName`,
  `museumLocation`
])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

//////////////
////CREATE////
//////////////

app.post('/art/paintings', function(req, res, next) {
  const paint = pathOr(null, ['body'], req)
  const checkResults = checkPaintingReqdFields(paint)

  if (checkResults.length > 0) {
    return next(
      new HTTPError(400, 'Bad request, missing required fields: ', {
        fields: checkResults
      })
    )
  }

  dal.createPainting(paint, callbackHelper(next, res))
})

////////////
////READ////
////////////

app.get('/art/paintings/:id', function(req, res, next) {
  const paintId = pathOr(null, ['params', 'id'], req)
  dal.getPainting(paintId, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    if (paintId) {
      res.status(200).send(data)
    } else {
      return next(new HTTPError(400, 'Missing id in path'))
    }
  })
})

//////////////
////UPDATE////
//////////////

app.put('/art/paintings/:id', function(req, res, next) {
  const paintId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  const checkResults = checkUpdatedPaintingReqdFields(body)
  if (checkResults.length > 0) {
    return next(
      new HTTPError(400, 'Bad request, missing required fields: ', {
        fields: checkResults
      })
    )
  }

  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing painting in request body.'))

  dal.updatePainting(body, paintId, callbackHelper(next, res))
})

//////////////
////DELETE////
//////////////

app.delete('/art/paintings/:id', function(req, res, next) {
  const paintId = pathOr(null, ['params', 'id'], req)

  dal.deletePainting(paintId, callbackHelper(next, res))
})

////////////
////LIST////
////////////

app.get('/art/paintings', function(req, res, next) {
  const paintingFilter = pathOr(null, ['query', 'filter'], req)
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)

  dal.listPaintings(
    lastItem,
    paintingFilter,
    Number(limit),
    callbackHelper(next, res)
  )
})

////Callbacker Helper (Just add callback!)////

const callbackHelper = (next, res) => (err, data) => {
  if (err) next(new HTTPError(err.status, err.message, err))
  res.status(200).send(data)
}

////Error Handler////
app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

////Shhhh, and...////

app.listen(port, () => console.log('API Running on port:', port))
