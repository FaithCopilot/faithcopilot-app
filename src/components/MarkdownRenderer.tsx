import { useEffect, useRef } from "react";
import Markdown, { RuleType } from "markdown-to-jsx";

//import { toast } from "@/components/Toast";
import { CopyButton } from "@/components/buttons/CopyButton";

export const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    children={children}
    options={{
      overrides: {
        CopyButton: {
          component: CopyButton,
        },
        //toast: {
        //  component: toast
        //},
        code: SyntaxHighlightedCode,
      },
    }}
  />
);

/**
 * Add the following tags to your page <head> to automatically load hljs and styles:

  <link
    rel="stylesheet"
    href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/nord.min.css"
  />

  * NOTE: for best performance, load individual languages you need instead of all
          of them. See their docs for more info: https://highlightjs.org/

  <script
    crossorigin
    src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"
  ></script>
 */

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

/*
import Markdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
import { stackoverflowDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = ({ children }: { children: string }) => (
  <Markdown
    className="prose-invert dark:prose-invert"
    remarkPlugins={[remarkGfm]}
    //children={typeof children === "string" ? children : JSON.stringify(children)}
    children={children}
    components={{
      a(props) {
        return <a {...props} className="links" />;
      },
      code(props) {
        // NOTE: in order for this to render without an Astro error,
        // https://github.com/withastro/astro/issues/5562
        // use "client:only" (instead of "client:load") in docs.astro
        const { children, className, node, ...rest } = props;
        const match = /language-(\w+)/.exec(className || "");
        return match ? (
          <div className="bg-pink-500 p-1 my-4 rounded">
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, "")}
              style={stackoverflowDark}
              language={match?.[1] || "plaintext"}
              PreTag="div"
              //{...rest} // TODO: make this work with tsc
            />
          </div>
        ) : (
          <span className="surfaces p-2 rounded">{children}</span>
        );
      }
    }}
  />
);
*/
