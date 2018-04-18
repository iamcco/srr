// page component
const pages = {}
/**
 * register
 *
 * @param {string} path
 * @param {element} component
 * @returns {undefined}
 */

const register = (path, component) => {
  if (process.env.NODE_ENV !== 'production' && pages[path]) {
    console.warn(`path ${path} exists`)
  }
  pages[path] = component
}

/**
 * getPageByRoute
 *
 * @param {string} path
 * @returns {element}
 */
const getPageByRoute = (path) => {
  return pages[path]
}

export default {
  register,
  getPageByRoute
}
