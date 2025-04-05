import { useRequest } from "@/hooks/use-request";

// NOTE: get all metrics at-once to avoid multiple fetches
// TODO: implement a more generic "filter" system
export const useAnalytics = ({
  start,
  end,
  metrics,
  service
}: {
  start?: Date;
  end?: Date;
  metrics?: string[];
  service?: string;
}) => {
  let url = "/v1/account/analytics";
  if (start && end) {
    url += `?start=${start.getTime()}&end=${end.getTime()}`;
  }
  if (metrics?.length && metrics.length > 0) {
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}metrics=${metrics.join(",")}`;
  }
  return useRequest(url);
};
