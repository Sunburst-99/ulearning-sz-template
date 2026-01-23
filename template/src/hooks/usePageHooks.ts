import { reactive, ref } from 'vue'

/**
 * 分页
 * @param fetch 请求方法
 * @param params 请求参数
 * @param pageKey 分页信息的 key 值，默认 { pageNum: 'pn', pageSize: 'ps' }
 * @returns
 */
export function usePageHooks<T>(
  fetch: (params: any) => Promise<any>,
  params = (): Object => ({}),
  pageKey = { pageNum: 'pn', pageSize: 'ps' }
) {
  
  // 分页信息
  const pageInfo = reactive({
    [pageKey.pageNum]: 1,
    [pageKey.pageSize]: 10
  })
  // 返回信息
  const resData = reactive({
    list: new Array<T>(),
    [pageKey.pageNum]: 0,
    [pageKey.pageSize]: 0,
    total: 0
  })

  const loading = ref(false);

  // 页码发生变化
  const handleCurrentChange = (val: number) => {
    pageInfo[pageKey.pageNum] = val
    getList()
  }

  // 获取列表
  const getList = async () => {
    const params_ = params()
    fetch({ ...pageInfo, ...params_ }).then(res => {
      resData.list = res.list
      resData[pageKey.pageNum] = res[pageKey.pageNum]
      resData[pageKey.pageSize] = res[pageKey.pageSize]
      resData.total = res.total
      return res.list
    })
  }

  // 搜索
  const search = () => {
    pageInfo[pageKey.pageNum] = 1
    resData.list.length = 0
    resData.total = 0
    getList()
  }

  // 删除后刷新列表
  const freshList = () => {
    // 最后一页只有一条数据且被删除时
    if(resData.total && resData.total % pageInfo[pageKey.pageSize] === 1) {
      pageInfo[pageKey.pageNum]--
    }
    getList()
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