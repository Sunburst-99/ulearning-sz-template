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
export function objectToQueryString(params: Record<string, any>): string {
  return Object.keys(params)
    .filter(key => params[key] !== null && params[key] !== undefined && params[key] !== '') // 过滤掉 null、 undefined、空字符串
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

/**
 * 下载
 * @param url
 * @param name
 */
export function download(url: string, name: string = '') {
  const xml = new XMLHttpRequest();
  xml.open('GET', url, true);
  xml.responseType = 'blob';
  xml.onload = function () {
    const url = window.URL.createObjectURL(xml.response);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
  };
  xml.send();
}