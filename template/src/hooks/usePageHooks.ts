import { reactive, ref } from 'vue'

export interface PageResponse<T> {
  list: T[]
  total: number
  [key: string]: unknown
}

/**
 * 分页
 * @param fetch 请求方法
 * @param params 请求参数
 * @param pageKey 分页信息的 key 值，默认 { pageNum: 'pn', pageSize: 'ps' }
 * @param isScroll 是否滚动分页，开启后追加后续页数据
 */
export function usePageHooks<T>(
  fetch: (params: Record<string, unknown>) => Promise<PageResponse<T>>,
  params: () => Record<string, unknown> = () => ({}),
  pageKey = { pageNum: 'pn', pageSize: 'ps' },
  isScroll = false,
) {
  // 分页信息
  const pageInfo = reactive({
    [pageKey.pageNum]: 1,
    [pageKey.pageSize]: 10
  })
  // 返回信息
  const resData = reactive<PageResponse<T>>({
    list: [],
    [pageKey.pageNum]: 0,
    [pageKey.pageSize]: 0,
    total: 0,
  })
  const loading = ref(false)
  let requestId = 0

  // 页码发生变化
  const handleCurrentChange = (val: number) => {
    if (isScroll && loading.value) return
    pageInfo[pageKey.pageNum] = Math.max(1, val)
    return getList()
  }

  // 获取列表
  const getList = async () => {
    const currentRequest = ++requestId
    const pageNum = pageInfo[pageKey.pageNum]
    const pageSize = pageInfo[pageKey.pageSize]
    loading.value = true
    try {
      const res = await fetch({ ...pageInfo, ...params() })
      // 快速切换页码或搜索时，只允许最后一次请求更新页面。
      if (currentRequest !== requestId) return res.list
      Object.assign(resData, {
        // 保留前面已加载的页；重试或刷新同一页时替换该页，避免重复追加。
        list: isScroll && pageNum > 1
          ? [...resData.list.slice(0, (pageNum - 1) * pageSize), ...res.list]
          : res.list,
        total: res.total,
        [pageKey.pageNum]: res[pageKey.pageNum],
        [pageKey.pageSize]: res[pageKey.pageSize],
      })
      return res.list
    } catch (error) {
      // 滚动加载失败后回到已成功的页码，下一次滚动仍请求失败的那一页。
      if (isScroll && currentRequest === requestId && pageNum > 1) {
        const previousPage = resData[pageKey.pageNum]
        if (typeof previousPage === 'number') {
          pageInfo[pageKey.pageNum] = Math.max(1, previousPage)
        }
      }
      throw error
    } finally {
      if (currentRequest === requestId) loading.value = false
    }
  }

  // 搜索
  const search = () => {
    pageInfo[pageKey.pageNum] = 1
    resData.list.length = 0
    resData.total = 0
    return getList()
  }

  // 删除后刷新列表
  const freshList = () => {
    if (isScroll) return search()
    const page = pageInfo[pageKey.pageNum]
    const size = pageInfo[pageKey.pageSize]
    // 只有当前位于最后一页且删掉该页唯一一条记录时，才回退一页。
    if (page > 1 && page === Math.ceil(resData.total / size) && resData.total % size === 1) {
      pageInfo[pageKey.pageNum]--
    }
    return getList()
  }

  return {
    pageInfo,
    resData,
    getList,
    handleCurrentChange,
    search,
    freshList,
    loading
  }
}
