require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .createIndex({ index: { fields: ['name'] } })
  .then(() => console.log('Created an index of names.'))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['type'] } })
  .then(() => console.log('Created an index of types.'))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['movement'] } })
  .then(() => console.log('Created an index of movement.'))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['artist'] } })
  .then(() => console.log('Created an index of artist.'))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['yearCreated'] } })
  .then(() => console.log('Created an index of yearCreated.'))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['museum'] } })
  .then(() => console.log('Created an index of museums.'))
  .catch(err => console.log(err))
