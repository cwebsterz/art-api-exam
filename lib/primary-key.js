const { concat, trim, toLower, replace, compose } = require('ramda')

module.exports = prefix => value =>
  compose(
    toLower,
    replace(/ /g, '_'),
    trim,
    replace('A', ''),
    replace('The', ''),
    concat(prefix)
  )(value)
