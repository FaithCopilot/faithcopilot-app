import { fetcher } from "@/services/fetch";

export const logout = async() => fetcher("/v1/auth/logout", { "x-redirect": { unauthorized: false, ok: true }})
