import { useState, useEffect, useRef } from 'react';

import Prism from 'prismjs';
//import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
//import "prismjs/themes/prism-solarizedlight.css";

export const CodeEditor = ({
  border,
  mode,
  value,
  onChange
}: {
  border?: boolean;
  mode: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  //const [code, setCode] = useState('// Write your code here\n');
  const code = value;
  const setCode = onChange;
  // TODO:
  const textareaRef = useRef(null);
  const preRef = useRef(null);
  const gutterRef = useRef(null);
  const lineCount = code.split('\n').length;

  // Generate line numbers efficiently
  const generateLineNumbers = (count) => {
    return Array.from({ length: count }, (_, i) => i + 1).join('\n');
  };

  // Update line numbers whenever code changes
  useEffect(() => {
    if (gutterRef.current) {
      gutterRef.current.textContent = generateLineNumbers(lineCount);
    }
  }, [lineCount]);

  // Sync scroll positions between textarea, code display, and line numbers
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const tabSpaces = Array.from({ length: 2 }, () => ' ').join('');
      const newCode = code.substring(0, start) + tabSpaces + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  const sharedStyles = {
    margin: 0,
    padding: '1rem',
    border: 'none',
    width: '100%',
    height: '100%',
    //height: '300px',
    fontSize: '14px',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    lineHeight: '1.5',
    overflow: 'auto',
    whiteSpace: 'pre',
    //boxSizing: 'border-box',
    backgroundColor: 'transparent'
  };

  useEffect(() => {
    const pre = document.getElementById('highlightedCode');
    if (pre) {
      Prism.highlightElement(pre); 
    }
  }, [code]); 

  return (
    <div className={["h-full w-full", border ? "border border-1 border-neutral-500 rounded" : ''].join(' ')}>
        <div className="h-full relative surfaces flex rounded">
          {/* Line numbers */}
          <div 
            className="h-full placeholders select-none backgrounds borders rounded-l"
            style={{ overflow: 'hidden' }}
          >
            <pre
              ref={gutterRef}
              className="text-right"
              style={{
                ...sharedStyles,
                overflow: 'hidden',
                padding: '1rem 0.5rem',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent'
              }}
            />
          </div>
          <div className="relative flex-1">
            {/* Syntax highlighted code */}
            <pre
              id="highlightedCode"
              ref={preRef}
              className="texts inputs language-javascript"
              style={{
                ...sharedStyles,
                position: 'absolute',
                pointerEvents: 'none',
                margin: 0
              }}
            >
              {code}
            </pre>

            {/* Editable textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleChange}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              style={{
                ...sharedStyles,
                position: 'relative',
                color: 'transparent',
                caretColor: 'white',
                resize: 'none',
                backgroundColor: 'transparent'
              }}
              className="focused rounded-r"
            />
          </div>
        </div>
    </div>
  );
};