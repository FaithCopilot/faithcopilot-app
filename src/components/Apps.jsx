//import { useEffect } from "react";

import { useRequest } from "@/hooks/use-request";

/*
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import html from './apps.html?raw';
*/

const Apps = () => {
  // enforces redirect to login if not authenticated
  const { data: account } = useRequest("/v1/account");
  /*
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const sanitizedContent = purify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
  */
  return null;
};
export default Apps;