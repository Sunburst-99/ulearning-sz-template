import Cookies from 'js-cookie'

const defaultCookieSetting = {
  expires: 8 / 24, // 设置 cookie 有效期为 8 小时
  // path: '/',
  domain: import.meta.env.VITE_COOKIE_DOMAIN
}

export function createCookie() {

  /**
   * @description 存储 cookie 值
   * @param {String} name cookie name
   * @param {String} value cookie value
   * @param {Object} setting cookie setting
   */
  function set<T = any>(key: string, data: T, setting = defaultCookieSetting) {
    const json = typeof data === 'string' ? data : JSON.stringify(data);
    Cookies.set(key, json, setting)
  }


  /**
   * @description 拿到 cookie 值
   * @param {String} name cookie name
   */
  function get(key: string, setting = defaultCookieSetting) {
    const json = Cookies.get(key)
    if (json) {
      try {
        return JSON.parse(json)
      } catch (err) {
        return json
      }
    }
    return json
  }


  /**
   * @description 删除 cookie
   * @param {String} name cookie name
   * @param {Object} setting cookie setting
   */
  function remove(key: string, setting = defaultCookieSetting) {
    Cookies.remove(key, setting)
  }

  /**
   * @description 删除 所有cookie
   * @param {Object} setting cookie setting
   */
  function clear(setting = defaultCookieSetting) {
    const arr = Cookies.get()
    for (const key in arr) {
      Cookies.remove(key, setting)
      Cookies.remove(key)
    }
  }

  return { set, get, remove, clear }
}

export default createCookie()
