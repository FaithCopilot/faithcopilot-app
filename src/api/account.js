import { ErrorConstants } from "@/constants";

/*
export const createAccount = async({ accountData }) => {
  const res = await fetch("/v1/account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountData),
  });
  if (res?.status === 201) {
    return { data: null, error: null };
  };
  return { data: null, error: ErrorConstants.GENERIC };
};
*/

export const updateAccount = async({ accountData }) => {
  const res = await fetch("/v1/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountData),
  });
  if (res?.status === 204) {
    return { data: null, error: null };
  };
  return { data: null, error: ErrorConstants.GENERIC };
};

export const deleteAccount = async() => {
  const res = await fetch("/v1/account", {
    method: "DELETE",
  });
  if (res?.status === 204) {
    return { data: null, error: null };
  };
  return { data: null, error: ErrorConstants.GENERIC };
};

export const createAPIKey = async(data) => {
  const res = await fetch("/v1/account/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (res?.status === 201) {
    const resData = await res.json();
    if (resData?.key) {
      return { data: resData, error: null };
    };
  };
  return { data: null, error: ErrorConstants.GENERIC };
};

export const deleteAPIKey = async({ id }) => {
  const res = await fetch(`/v1/account/api-keys/${id}`, {
    method: "DELETE",
  });
  if (res?.status === 204) {
    return { data: null, error: null };
  };
  return { data: null, error: ErrorConstants.GENERIC };
};
