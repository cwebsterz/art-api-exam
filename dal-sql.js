const mysql = require('mysql')
const HTTPError = require('node-http-error')
const dalHelper = require('./lib/dal-helper')
const { assoc, prop, compose, omit } = require('ramda')

////CREATE////

const createPainting = (painting, cb) =>
  dalHelper.create('painting', painting, prepPaintingForInsert, cb)

////READ////

const getPainting = (id, cb) =>
  dalHelper.read('painting', 'ID', id, formatPainting, cb)

////UPDATE////

const updatePainting = (painting, id, cb) =>
  dalHelper.update(
    'painting',
    prepPaintingForUpdate(painting),
    'ID',
    Number(id),
    cb
  )

////DELETE////

const deletePainting = (id, cb) =>
  dalHelper.deleteItem('painting', 'ID', id, cb)

////LIST////

const listPaintings = (lastItem, filter, limit, cb) => {
  dalHelper.queryDB(
    'painting',
    lastItem,
    filter,
    limit,
    formatPainting,
    'ID',
    (err, data) => (err ? cb(err) : cb(null, data))
  )
}

////Formatters////

const prepPaintingForInsert = painting => {
  return compose(omit('_rev'), omit('_id'), omit('type'))(painting)
}

const formatPainting = painting => {
  painting = assoc('_id', prop('ID', painting), painting)
  return compose(omit('ID'), assoc('_rev', null), assoc('type', 'painting'))(
    painting
  )
}

const prepPaintingForUpdate = painting => {
  painting = assoc('ID', prop('_id', painting), painting)

  return compose(omit('_id'), omit('_rev'), omit('type'))(painting)
}

const dal = {
  createPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings
}

module.exports = dal
