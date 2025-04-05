import { useEffect, useRef } from "react";
import Markdown, { RuleType } from "markdown-to-jsx";

import { CopyButton } from "@/components/buttons/CopyButton";

export const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    children={children}
    options={{
      overrides: {
        CopyButton: {
          component: CopyButton,
        },
        code: SyntaxHighlightedCode,
      },
    }}
  />
);

const SyntaxHighlightedCode = (props: any) => {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    if (ref?.current && props?.className?.includes('lang-') && (window as any)?.hljs) {
      (window as any)?.hljs?.highlightElement(ref?.current)

      // hljs won't reprocess the element unless this attribute is removed
      ref?.current?.removeAttribute('data-highlighted')
    }
  }, [props?.className, props?.children]);

  return <code {...props} ref={ref} />;
};