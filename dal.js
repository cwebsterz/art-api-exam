const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

const bldPrimaryKey = require('./lib/primary-key')
const paintPKGenerator = bldPrimaryKey('painting_')

const { assoc, split, head, last, compose } = require('ramda')

//////////////
////CREATE////
//////////////

function createPainting(paint, callback) {
  const pk = paintPKGenerator(paint.name)
  paint = compose(assoc('_id', pk), assoc('type', 'painting'))(paint)
  addDoc(paint, callback)
}

////////////
////READ////
////////////

function getPainting(paintingId, callback) {
  db.get(paintingId, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'painting'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'Bad request, ID must be a painting'))
  })
}

//////////////
////UPDATE////
//////////////

function updatePainting(paint, callback) {
  paint = assoc('type', 'painting', paint)
  db.put(paint, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

//////////////
////DELETE////
//////////////

function deletePainting(paintingId, callback) {
  db
    .get(paintingId)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

////////////
////LIST////
////////////

const listPaintings = (lastItem, paintingFilter, limit, callback) => {
  var query = {}
  if (paintingFilter) {
    const arrFilter = split(':', paintingFilter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const selectorValue = {}
    selectorValue[filterField] = Number(filterValue)
      ? Number(filterValue)
      : filterValue

    query = { selector: selectorValue, limit }
  } else if (lastItem) {
    query = { selector: { _id: { $gt: lastItem }, type: 'painting' }, limit }
  } else {
    query = { selector: { _id: { $gte: null }, type: 'painting' }, limit }
  }

  finder(query, callback)
}

////Helper(s)////

const finder = (query, cb) =>
  query
    ? db.find(query).then(res => cb(null, res.docs)).catch(err => cb(err))
    : cb(null, [])

function addDoc(doc, callback) {
  db.put(doc, function(err, doc) {
    if (err) callback(err)
    callback(null, doc)
  })
}

const dal = {
  createPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings
}

module.exports = dal
