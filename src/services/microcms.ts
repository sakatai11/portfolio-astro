import { createClient } from 'microcms-js-sdk'
import type { MicroCmsRequest } from '@/types/index'

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
