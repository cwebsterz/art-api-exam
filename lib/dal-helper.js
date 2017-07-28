require('dotenv').config()
const HTTPError = require('node-http-error')
const {
  propOr,
  compose,
  prop,
  assoc,
  split,
  head,
  last,
  map,
  omit
} = require('ramda')
const mysql = require('mysql')

//////////////////////////////
///  HELPERS
//////////////////////////////

////Create////

const create = (tableName, data, formatter, cb) => {
  if (data) {
    const connection = createConnection()

    const sql = `INSERT INTO ${connection.escapeId(tableName)} SET ? `
    connection.query(sql, formatter(data), (err, result) => {
      if (err) return cb(err)

      propOr(null, 'insertId', result)
        ? cb(null, { ok: true, id: result.insertId })
        : cb(null, { ok: false, id: null })
    })
    connection.end(err => cb(err))
  }
}

////////////////////////////////

////Read////
const read = (tableName, columnName, id, formatter, cb) => {
  if (id && tableName) {
    const connection = createConnection()

    connection.query(
      'SELECT * FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      [id],
      function(err, result) {
        if (err) return cb(err)
        if (propOr(0, 'length', result) > 0) {
          const formattedResult = formatter(head(result))
          return cb(null, formattedResult)
        } else {
          return cb(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  }
}
////////////////////////////////

////Update////
const update = (tableName, data, columnName, id, cb) => {
  if (data) {
    const connection = createConnection()
    data = omit('ID', data)

    const sql =
      'UPDATE ' +
      connection.escapeId(tableName) +
      ' SET ? ' +
      ' WHERE ' +
      connection.escapeId(columnName) +
      ' =  ?'

    connection.query(sql, [data, id], function(err, result) {
      if (err) return cb(err)
      if (propOr(0, 'affectedRows', result) === 1) {
        return cb(null, { ok: true, id: id })
      } else if (propOr(0, 'affectedRows', result) === 0) {
        return cb(
          new HTTPError(404, 'missing', {
            name: 'not_found',
            error: 'not found',
            reason: 'missing'
          })
        )
      }
    })

    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return cb(new HTTPError(400, 'Missing data for update.'))
  }
}

////////////////////////////////

////Delete////
const deleteItem = (tableName, columnName, id, cb) => {
  if (tableName && id) {
    const connection = createConnection()

    connection.query(
      'DELETE FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      [id],
      function(err, result) {
        if (err) return cb(err)
        if (result && result.affectedRows === 1) {
          return cb(null, { ok: true, id: id })
        } else if (result && result.affectedRows === 0) {
          return cb(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
    connection.end(err => err)
  } else {
    return cb(new HTTPError(400, 'Missing id.'))
  }
}
////////////////////////////////

////List////
const list = (tableName, formatter, cb) => {
  if (tableName) {
    const connection = createConnection()

    connection.query(
      'SELECT * FROM ' + connection.escapeId(tableName),
      function(err, result) {
        if (err) return cb(err)
        if (propOr(0, 'length', result) > 0) {
          const formattedResult = formatter(result)
          return cb(null, formattedResult)
        } else {
          return cb(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  }
}

////////////////////////////////

const queryDB = (
  tableName,
  lastItem,
  filter,
  limit,
  formatter,
  orderColumn,
  cb
) => {
  limit = limit ? limit : 5

  const connection = createConnection()

  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${filterField} = ?
    ORDER BY ${connection.escapeId(orderColumn)}
    LIMIT ${limit}`

    connection.query(sql, [filterValue], function(err, result) {
      if (err) return cb(err)
      return cb(null, map(formatter, result))
    })
  } else if (lastItem) {
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${connection.escapeId(orderColumn)} > ?
    ORDER BY ${connection.escapeId(orderColumn)}
    LIMIT ${limit}`

    connection.query(sql, [lastItem], function(err, result) {
      if (err) return cb(err)
      return cb(null, map(formatter, result))
    })
  } else {
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    ORDER BY ${connection.escapeId(orderColumn)}
    LIMIT ${limit}`

    connection.query(sql, function(err, result) {
      if (err) return cb(err)
      return cb(null, map(formatter, result))
    })
  }
}

/////////////////////////////////////////
/////////////////////////////////////////

const groupBy = (viewName, reportedView, cb) => {
  const connection = createConnection()
  connection.query(`SELECT * FROM ` + connection.escapeId(viewName), function(
    err,
    result
  ) {
    if (err) return cb(err)
    return cb(null, {
      reportName: 'Painting count by ' + reportedView,
      reportData: result
    })
  })
}

/////////////////////////////////////////
/////////////////////////////////////////

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const dalHelper = {
  read,
  queryDB,
  deleteItem,
  update,
  create,
  list,
  groupBy
}

module.exports = dalHelper
