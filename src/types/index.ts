import type { MicroCMSQueries, MicroCMSDate } from "microcms-js-sdk";

export type MicroCmsRequest = { endpoint: string; queries?: MicroCMSQueries };

export type PhotosMain = {
  id: string;
  main: PhotoInfo;
  title: string;
} & MicroCMSDate

type PhotoInfo = {
  url: string;
  height: number;
  width: number;
};
