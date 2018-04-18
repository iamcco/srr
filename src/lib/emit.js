const events = {}

/**
 * addListener
 *
 * @param {string} event
 * @param {function} cb
 * @returns {undefined}
 */
const addListener = (event, cb) => {
  events[event] = events[event] || []
  events[event].push(cb)
}

/**
 * removeListener
 * @param {string} event
 * @param {function} cb
 * @returns {undefined}
 */
const removeListener = (event, cb) => {
  if (!cb) {
    events[event] = null
  } else {
    const cbs = events[event]
    if (cbs && cbs.length) {
      events[event] = cbs.filter(item => item !== cb)
    }
  }
}

/**
 * trigger
 *
 * @param {string} event
 * @param {object} data
 * @returns {undefined}
 */
const trigger = (event, data) => {
  const cbs = events[event]
  if (cbs && cbs.length) {
    cbs.forEach(cb => cb(data))
  }
}

export default {
  addListener,
  removeListener,
  trigger
}
