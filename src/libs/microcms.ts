import { createClient } from "microcms-js-sdk";
import type { MicroCmsRequest } from "@/types/index";

export const microCMSClient = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: import.meta.env.MICROCMS_API_KEY,
});

export const getMicroCmsList = async <T>({
  endpoint,
  queries,
}: MicroCmsRequest) => {
  const response = await microCMSClient.getList<T>({ endpoint, queries });
  return response.contents;
};
