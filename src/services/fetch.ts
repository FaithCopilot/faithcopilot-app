const isRedirect = (status: number): boolean => {
  return (
    status === 301 ||
    status === 302 ||
    status === 303 ||
    status === 307 ||
    status === 308
  );
};

export const fetcher = async (url: string, options: any): Promise<Response> => {
  if (!options) options = {};
  let redirect = { unauthorized: true, ok: false };
  if (options?.["x-redirect"]) {
    redirect = options["x-redirect"];
    delete options["x-redirect"];
  }
  const baseURL = process.env.PUBLIC_API_URL ?? "";
  options["credentials"] = "include";
  const res = await fetch(baseURL + url, options);
  // special handler for login page
  if (window?.location?.pathname?.startsWith("/login") && res?.ok) {
    const location = res.headers.get("X-Location");
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect");
    // IF server-redirect === '/' (HOME)
    // AND client-redirect exists ("?redirect=" param),
    // THEN use client-side redirect
    if (location === "/" && redirectParam !== null) {
      window.location.replace(redirectParam);
      return res;
    }
  }
  if (
    (isRedirect(res?.status) ||
      //(res?.type === "opaqueredirect" || res?.type === "opaqueredirects") ||
      res?.type === "opaqueredirect" ||
      res?.type === "opaque" ||
      (res?.status === 401 && redirect?.unauthorized !== false) ||
      (res?.ok && redirect?.ok !== false)) &&
    window?.location
  ) {
    // check server-specified redirect (eg, onboarding)
    const location = res.headers.get("X-Location");
    if (location) {
      //console.log("*** REDIRECT (LOCATION): ", location);
      window.location.replace(location);
      return res;
    }
    // check (user-visible) URL param redirect
    const urlParams = new URLSearchParams(window.location.search);
    const redirectParam = urlParams.get("redirect");
    if (redirectParam) {
      //console.log("*** REDIRECT (PARAM): ", redirectParam);
      window.location.replace(redirectParam);
      return res;
    }
    // default redirect (unless "ok"; expect above conditions to handle)
    if (!res?.ok) {
      let redirectPathname = "";
      if (window.location.pathname !== "/") {
        redirectPathname = `?redirect=${window.location.pathname}`;
      }
      //console.log("*** REDIRECT (PATHNAME): ", `/login${redirectPathname}`);
      window.location.replace(`/login${redirectPathname}`);
      return res;
    }
  }
  return res;
};

export const jsonFetcher = async (url: string, options: any): Promise<any> => {
  const res = await fetcher(url, options);
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res.json();
};
