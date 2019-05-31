import {
  request
} from '../../utils/request.js'

function getKeys(str) {
  let keys = new Set(str.split(' '))
  keys.delete('')
  return [...keys].join(',')
}

export function search(type, page, limit, str) {
  return request('search.php', {
    type, keys: getKeys(str), page, limit
  })
}