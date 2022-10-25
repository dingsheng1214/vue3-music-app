
function get(key: string) {
  return sessionStorage.getItem(key)
}

function set<T>(key: string, val: T) {
  sessionStorage.setItem(key, JSON.stringify(val))
}

function init<T>(key: string, initVal: T) {
  let val = get(key)
  if(val) {
    initVal = JSON.parse(val)
  }
  return initVal
}

export default {
  get,
  set,
  init
}

