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
  let pathPattern
  const items = path.match(/(:[^/?#]+)/ig)
  if (items) {
    pathPattern = items.reduce((reg, next) => {
      return reg.replace(next, '([^/]+)')
    }, path)
  }
  if (process.env.NODE_ENV !== 'production' && pages[pathPattern || path]) {
    console.warn(`path ${path} exists`)
  }
  pages[pathPattern || path] = {
    param: items ? items.map(item => item.slice(1)) : items,
    pattern: pathPattern ? new RegExp(`^${pathPattern}$`, 'i') : null,
    component
  }
}

/**
 * getPageByRoute
 *
 * @param {string} path
 * @returns {element}
 */
const getPageByRoute = (path) => {
  let result
  Object.keys(pages).some((pattern) => {
    const page = pages[pattern]
    if (page.pattern) {
      const param = path.match(page.pattern)
      if (param) {
        result = {
          ...page,
          param: page.param.reduce((res, next, idx) => {
            res[next] = param[idx + 1]
            return res
          }, {})
        }
        return true
      }
    }
    if (path === pattern) {
      result = {
        ...page
      }
      return true
    }
    return false
  })
  return result
}

export default {
  register,
  getPageByRoute
}
