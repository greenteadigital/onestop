/*
 * Lodash
 */

// cherry pick functions used to prevent lodash bundle bloat
import _chain from 'lodash/chain'
import _isArray from 'lodash/isArray'
import _isObject from 'lodash/isObject'
import _isError from 'lodash/isError'
import _concat from 'lodash/concat'
import _map from 'lodash/map'
import _assign from 'lodash/assign'
import _every from 'lodash/every'
import _round from 'lodash/round'
import _size from 'lodash/size'
import _join from 'lodash/join'
import _slice from 'lodash/slice'
import _words from 'lodash/words'
import _startCase from 'lodash/startCase'
import _toLower from 'lodash/toLower'
import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import _trim from 'lodash/trim'
import _flatten from 'lodash/flatten'
import _compact from 'lodash/compact'
import _filter from 'lodash/filter'
import _find from 'lodash/find'
import _forOwn from 'lodash/forOwn'
import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'
import _capitalize from 'lodash/capitalize'
import _each from 'lodash/each'
import _flatMap from 'lodash/flatMap'

export const _ = {
  chain: _chain,
  isArray: _isArray,
  isObject: _isObject,
  isError: _isError,
  concat: _concat,
  map: _map,
  assign: _assign,
  every: _every,
  round: _round,
  size: _size,
  join: _join,
  slice: _slice,
  words: _words,
  startCase: _startCase,
  toLower: _toLower,
  isEmpty: _isEmpty,
  reduce: _reduce,
  trim: _trim,
  flatten: _flatten,
  compact: _compact,
  filter: _filter,
  find: _find,
  forOwn: _forOwn,
  isEqual: _isEqual,
  get: _get,
  capitalize: _capitalize,
  each: _each,
  flatMap: _flatMap
}

// include any non-"en" locales ignored in webpack for bundle minification
// e.g. - import 'moment/locale/pl'