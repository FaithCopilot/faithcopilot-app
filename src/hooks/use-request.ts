import useSWR from "swr";
import { jsonFetcher } from "@/services/fetch";
export const useRequest = (url: string) => useSWR<any, string, any>(url, jsonFetcher);
