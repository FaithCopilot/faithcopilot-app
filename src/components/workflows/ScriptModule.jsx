import { useState } from "react";
import sandboxModule from "@nyariv/sandboxjs";
const Sandbox = sandboxModule.default || sandboxModule;
const sandbox = new Sandbox();

import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/buttons/Button";
import { CopyButton } from "@/components/buttons/CopyButton";
import { Label } from "@/components/fields/Label";

import {
  ICON_SIZE,
  SaveIcon,
  TestIcon
} from "@/components/Icons";

const deepJsonParse = (input) => {
  if (input === null || input === undefined) {
    return input;
  };
  if (typeof input === "string") {
    try {
      return deepJsonParse(JSON.parse(input));
    } catch {
      return input;
    }
  };
  // if an array, map each element
  if (Array.isArray(input)) {
    return input.map(deepJsonParse);
  };
  // if an object, recursively parse each value
  if (typeof input === "object") {
    const result = {};
    for (const [key, value] of Object.entries(input)) {
      result[key] = deepJsonParse(value);
    };
    return result;
  };
  // for primitive types, return as-is
  return input;
};

const runCode = async (args, codeToEval) => {
  args = deepJsonParse(args);
  const exec = sandbox.compile(codeToEval);
  let output = await exec({ args })?.run();
  output = deepJsonParse(output);
  return output;
};

const prettifyJavaScript = (code) => {
  // track indentation level
  let indentLevel = 0;
  let formattedCode = '';
  let inString = false;
  let stringChar = '';
  let lastChar = '';
  
  // characters that should trigger new lines
  const newLineChars = ['{', '}', ';'];
  // characters that should increase indent
  const indentChars = ['{'];
  // characters that should decrease indent
  const unindentChars = ['}'];
  
  function getIndentation() {
    return '  '.repeat(indentLevel);
  };
  
  // process the code character by character
  for (let ii = 0; ii < code.length; ii++) {
    const char = code[ii];
    // handle strings
    if ((char === '"' || char === "'" || char === '`') && lastChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      };
    };
    if (!inString) {
      // Handle indentation changes
      if (indentChars.includes(char)) {
        indentLevel++;
      } else if (unindentChars.includes(char)) {
        indentLevel = Math.max(0, indentLevel - 1);
      };
      // add new lines and proper indentation
      if (newLineChars.includes(char)) {
        formattedCode += char + '\n' + getIndentation();
      } else if (char === '\n') {
        formattedCode += '\n' + getIndentation();
      } else if (!char.match(/\s/) || char === ' ') {
        // remove extra spaces but keep single spaces
        if (!(char === ' ' && lastChar === ' ')) {
          formattedCode += char;
        };
      };
    } else {
      // if in a string, just add the character as is
      formattedCode += char;
    };
    lastChar = char;
  };
  // clean up multiple new lines
  formattedCode = formattedCode.replace(/\n\s*\n/g, '\n');
  return formattedCode;
};

// TODO: move this to a utility file
const safeStringify = (value) => {
  if (value === null || value === undefined) {
    return '';
  };
  return typeof value !== "string" ? JSON.stringify(value, null, 2) : value; 
};

/*
values = step definition
values: {
  args: {
    "systemMessage": "{{systemMessage}}",
    "messages": "{{args.data.messages}}",
    "env": "{{args.env}}",
    "code": "if (args?.systemMessage && args?.messages?.find(m => m.role === \"system\") === undefined) { return [{ \"role\": \"system\", \"content\": args.systemMessage }, ...args.messages]; } return args.messages;"
  },
  ..., // other fields
}
*/
const ScriptModule = ({ label, values, setValues, dismiss }) => {
  const [stepName, setStepName] = useState(values?.name ?? values?.call ?? '');
  const [namedResult, setNamedResult] = useState(values?.result ?? '');
  const [code, setCode] = useState(values?.args?.code ? prettifyJavaScript(values.args.code) : '');
  const codelessArgs = { ...values?.args };
  delete codelessArgs.code;
  const [args, setArgs] = useState(codelessArgs ?? {});
  const [testResults, setTestResults] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const onSave = () => {
    setValues({
      ...values,
      name: stepName,
      args: {
        ...args,
        code
      },
      result: namedResult
    });
    dismiss();
  };
  return(
    <div className="w-full flex flex-row space-x-4">
      <div
        className={[
          "flex flex-col justify-between",
          showTest ? "w-full md:w-1/2" : "w-full"
        ].join(' ')}
      >
        <div className="flex flex-col space-y-4">
          <Label label="Name" className="uppercase">
            <input
              type="text"
              value={stepName}
              onChange={(evt) => setStepName(evt.target.value)}
              className="inputs"
            />
          </Label>
          <Label label={label ?? "Script"} className="uppercase flex flex-row">
            <div className="w-full h-[450px]">
              <CodeEditor
                border
                mode="javascript"
                value={code}
                onChange={setCode}
              />
            </div>
          </Label>
          <div className="w-full md:w-1/2">
            <Label
              label="Named Result"
              className="uppercase"
              help={(
                <div className="flex flex-col space-y-2">
                  <span>Named Result is the variable name of the stored output data of this step.</span>
                  <span>It may be used in a later step via a <i>template</i> - eg, "{"{{step1Result}}"}"</span>
                </div>
              )}
            >
              <input
                type="text"
                value={namedResult}
                onChange={(evt) => setNamedResult(evt.target.value)}
                className="inputs"
              />
            </Label>
          </div>
          <div className="flex flex-row space-x-2 ms-auto px-2 pt-4">
            <Button
              variant="link"
              label="Cancel"
              onClick={() => dismiss()}
            />
            { !showTest && (
              <Button
                variant="surface"
                icon={<TestIcon size={ICON_SIZE} />}
                label="Test"
                onClick={() => {
                  setTestResults(null);
                  setShowTest(true)
                }}
              />
            )}
            <Button
              variant="primary"
              icon={<SaveIcon size={ICON_SIZE} />}
              label="Save"
              onClick={onSave}
            />
          </div>
        </div>
      </div>
      { showTest && (
        <div className="w-full md:w-1/2 flex flex-col justify-between px-2">
          <div className="flex flex-col space-y-4">
            <Label label="Simulate Args" className="uppercase" help={(
              <h1>Help!</h1>
            )}>
              <div className="w-full h-[150px]">
                <CodeEditor
                  border
                  mode="javascript"
                  value={safeStringify(args)}
                  onChange={(_args) => setArgs(_args)}
                />
              </div>
            </Label>
            <div className="w-24 flex ms-auto pe-2">
              <Button
                variant="surface"
                icon={<TestIcon size={ICON_SIZE} />}
                label="Test"
                onClick={async() => {
                  try {
                    const _testResults = await runCode(args, code);
                    if (!_testResults) {
                      throw new Error("undefined");
                    };
                    setTestResults(_testResults)
                  } catch (error) {
                    setTestResults(error.message);
                  }
                }}
              />
            </div>
            { testResults && (
              <Label label="Test Results" className="uppercase">
                <textarea
                  type="text"
                  value={safeStringify(testResults)}
                  readOnly
                  className="inputs h-[150px] overflow-y-auto"
                />
              </Label>
            )}
          </div>
          <div className="flex flex-row space-x-2 ms-auto px-2 pt-4">
            <Button
              label="Close"
              onClick={() => setShowTest(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default ScriptModule;