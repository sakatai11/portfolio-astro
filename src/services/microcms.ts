import { createClient } from 'microcms-js-sdk'
import type { MicroCmsRequest } from '@/types/index'
import { MICROCMS_MAX_LIMIT } from '@/constants/index'

export const microCMSClient = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
})

export const getMicroCmsList = async <T>({
  endpoint,
  queries,
}: MicroCmsRequest) => {
  const response = await microCMSClient.getList<T>({ endpoint, queries })
  return response.contents
}

/**
 * contents に加えて totalCount 等を含むレスポンス全体を返す。
 * ページネーション (次ページの有無判定) が必要な場合に使用する。
 */
export const getMicroCmsListResponse = async <T>({
  endpoint,
  queries,
}: MicroCmsRequest) => {
  return await microCMSClient.getList<T>({ endpoint, queries })
}

/**
 * MicroCMS の取得上限 (100件) を超えるコンテンツを offset 送りで全件取得する。
 * 年別ページのように「絞り込みなしで全コンテンツが必要」なケースで使用する。
 * queries に limit / offset を渡しても内部の値で上書きされる。
 */
export const getMicroCmsAllList = async <T>({
  endpoint,
  queries,
}: MicroCmsRequest) => {
  const contents: T[] = []

  for (let offset = 0; ; offset += MICROCMS_MAX_LIMIT) {
    const response = await microCMSClient.getList<T>({
      endpoint,
      queries: { ...queries, limit: MICROCMS_MAX_LIMIT, offset },
    })

    contents.push(...response.contents)

    // 取得済み件数が総件数に達した時点で終了する
    // (空レスポンス時のガードも兼ねて無限ループを防ぐ)
    if (
      response.contents.length === 0 ||
      contents.length >= response.totalCount
    )
      break
  }

  return contents
}

export const getMicroCmsDetail = async <T>({
  endpoint,
  contentId,
  queries,
}: MicroCmsRequest & { contentId: string }) => {
  const response = await microCMSClient.get<T>({
    endpoint,
    contentId,
    queries,
  })
  return response
}
