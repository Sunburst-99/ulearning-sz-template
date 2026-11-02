import dayjs from "dayjs"

// 时间格式化
export function dateFormat(date: string | number, formatStr: string) {
  return dayjs(date).format(formatStr)
}

/**
 * 将对象转为url查询字符串
 * @param params 
 * @returns 
 */
export function objectToQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '') // 过滤掉 null、 undefined、空字符串
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
    .join('&');
}

/**
 * 下载
 * @param url
 * @param name
 */
export async function download(url: string, name = '') {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`下载失败（HTTP ${response.status}）`)
  const objectUrl = URL.createObjectURL(await response.blob())
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = name
  document.body.appendChild(anchor)
  try {
    anchor.click()
  } finally {
    anchor.remove()
    // 给浏览器留出开始下载的时间，再释放 Blob URL。
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
}
