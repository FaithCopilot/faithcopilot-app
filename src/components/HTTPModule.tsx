import { useEffect, useState } from "react";

import { CodeEditor } from "@/components/CodeEditor";

import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { KeyValue } from "@/components/fields/KeyValue";
import { Select } from "@/components/fields/Select";

import {
  ICON_SIZE,
  SaveIcon,
  TestIcon,
} from "@/components/Icons";

import { resolveTemplate } from "@/services/parser/template";

// TODO:
// New method to safely parse JSON
const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return str;
  };
};

export const mapHeaders = (headers: any) => {
  let mappedHeaders: any = {};
  for (let ii = 0; ii < headers?.length; ii++) {
    const header = headers[ii];
    const { key, value } = header;
    if (!key || !value) {
      continue;
    }
    mappedHeaders[key] = value;
  }
  return mappedHeaders;
};

const mergeTestValues = (values: any, testValue: string) => {
  const parsedTestValues = safeParse(testValue);
  let resolvedValues = { ...values };
  resolvedValues["url"] = resolveTemplate(values["url"], parsedTestValues);
  // map headers to resolved values
  if (values["headers"]) {
    resolvedValues["headers"] = values["headers"].map((header: any) => {
      const resolvedValue = resolveTemplate(header.value, parsedTestValues);
      return {
        ...header,
        value: resolvedValue 
      };
    });
  };
  // map body to resolved values
  if (values["body"]) {
    resolvedValues["body"] = resolveTemplate(values["body"], parsedTestValues);
  };
  let mergedValues = { ...values };
  if (resolvedValues["url"]) {
    mergedValues["url"] = resolvedValues["url"];
  };
  if (resolvedValues["headers"]) {
    mergedValues["headers"] = resolvedValues["headers"];
  };
  if (resolvedValues["body"]) {
    mergedValues["body"] = resolvedValues["body"];
  };
  return mergedValues;
};

const mapValuesToProxyBody = (values: any) => {
  const proxyBody = {};
  let url = new URL(values?.url);
  if (values?.searchParams) {
    for (let ii = 0; ii < values?.searchParams.length; ii++) {
      const param = values?.searchParams[ii];
      if (!param?.key) {
        continue;
      }
      url.searchParams.append(param.key, param?.value ?? '');
    };
  };
  proxyBody["url"] = url;
  if (values?.method) {
    proxyBody["method"] = values?.method;
  };
  if (values?.headers) {
    // map { id, key, value } to { key: value }
    const mappedHeaders = mapHeaders(values?.headers);
    proxyBody["headers"] = mappedHeaders;
  };
  if (values?.body) {
    proxyBody["body"] = values?.body;
  };
  return proxyBody;
};

// TODO: componentize (w/ WorkflowDefinitionEditor)
const CodeEditorJSON = ({
  border,
  label,
  value,
  onChange,
}: {
  border?: boolean;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <Label label={label} className="uppercase">
    <div className="w-full h-[200px]">
      <CodeEditor
        border={border}
        mode="javascript"
        value={value}
        onChange={onChange}
      />
    </div>
  </Label>
);

const Tester = ({
  values,
  proxyURL,
  setShowTest,
}: {
  values: any;
  proxyURL: string;
  setShowTest: (show: boolean) => void;
}) => {
  const [testValue, setTestValue] = useState('');
  const [testResults, setTestResults] = useState(null);
  return(
    <div className="h-full w-full flex flex-col justify-between px-2">
      <div className="flex flex-col space-y-4">
        <CodeEditorJSON
          border
          label="Args"
          value={testValue}
          onChange={(value: string) => setTestValue(value)}
        />
        <div className="flex flex-row space-x-2 ms-auto pe-2">
          <Button
            variant="link"
            label="Cancel Test"
            onClick={() => setShowTest(false)}
          />
          <Button
            variant="surface"
            icon={<TestIcon size={ICON_SIZE} />}
            label="Test"
            onClick={async() => {
              const mergedValues = mergeTestValues(values, testValue);
              const proxyBody = mapValuesToProxyBody(mergedValues);
              const options = {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(proxyBody)
              };
              const res = await fetch(process.env.PUBLIC_API_URL + proxyURL, {
                ...options,
                credentials: "include"
              });
              const resText = await res.text();
              //setTestResults('{ "items": [{"choices": [{"content": "Hello, World!"}]}]}');
              setTestResults(resText);
            }}
          />
        </div>
        { testResults && (
          <Label label="Test Results" className="uppercase">
            <textarea
              value={testResults}
              readOnly
              className="inputs h-[150px] overflow-y-auto"
            />
          </Label>
        )}
      </div>
    </div>
  );
};

export const BodyWithHelp = () => (
  <div className="pt-4">
    <Label label="Body" className="uppercase" help={` 
      The Body is OpenAI API format. It should contain the messages array with the user and system messages.
    `}/>
  </div>
);

export const HTTPModule = ({
  hasBody,
  proxyURL,
  name,
  setName,
  defaultValues,
  values,
  setValues,
  children,
  onSave,
  dismiss
}: {
  hasBody: boolean;
  proxyURL: string;
  name: string;
  setName: (name: string) => void;
  defaultValues?: any;
  values?: any;
  setValues?: (values: any) => void
  children?: any;
  onSave: (values: any) => void;
  dismiss?: () => void;
}) => {

  if (!proxyURL) proxyURL = "/v1/proxy";

  if (!defaultValues && values) {
    defaultValues = { ...values };
  };

  const [_values, _setValues] = useState<any>(defaultValues ?? {});
  const [showTest, setShowTest] = useState(false);

  useEffect(() => {
    setValues?.(_values);
  }, [_values]);

  return (
    <div className="h-full w-full flex flex-col space-y-16 md:space-y-0 md:flex-row md:space-x-4 justify-between">
      <div className="flex flex-col space-y-4 h-full w-full max-w-[350px] md:max-w-full">
        { setName && (
          <Label label="Name" className="uppercase">
            <input
              type="text"
              value={name ?? ''}
              onChange={(evt) => setName(evt.target.value)}
              className="inputs"
            />
          </Label>
        )}
        <Label label="URL" className="uppercase">
          <input
            type="text"
            value={_values?.url ?? ''}
            onChange={(evt) =>
              _setValues({
                ..._values,
                url: evt.target.value
              })
            }
            className="inputs"
          />
        </Label>
        <Label label="Method" className="uppercase">
          <Select
            items={[
              { label: "GET", value: "GET" },
              { label: "POST", value: "POST" },
              { label: "PUT", value: "PUT" }
              //{ label: "DELETE", value: "DELETE" },
            ]}
            value={_values?.method ?? ''}
            onChange={(__value: string) =>
              _setValues({ ..._values, method: __value })
            }
            placeholder="Select"
          />
        </Label>
        <Label label="Headers" className="uppercase">
          <KeyValue
            values={_values?.headers ?? []}
            onChangeValues={(__values: any) => 
              _setValues({
                ..._values,
                headers: __values
              })
            }
          />
        </Label>
        { hasBody && (
          <Label label="Body" className="uppercase">
            <div className="w-full h-[200px]">
              <CodeEditor
                border
                mode="javascript"
                value={_values?.body ?? ''}
                onChange={(__value: string) =>
                  _setValues({
                    ..._values,
                    body: __value
                  })
                }
              />
            </div>
          </Label>
        )}
        { children }
        { (onSave || proxyURL || dismiss) && (
          <div className="flex flex-row space-x-2 ms-auto px-2 pt-4">
            { dismiss && (
              <Button
                variant="link"
                label="Cancel"
                onClick={() => dismiss()}
              />
            )}
            { !showTest && proxyURL && (
              <Button
                variant="surface"
                icon={<TestIcon size={ICON_SIZE} />}
                label="Test"
                onClick={() => setShowTest(true)}
              />
            )}
            { onSave && (
              <Button
                variant="primary"
                icon={<SaveIcon size={ICON_SIZE} />}
                label="Save" // TODO: disable if state not "dirty"
                onClick={() => onSave(_values)}
              />
            )}
          </div>
        )}
      </div>
      { showTest && (
        <Tester
          values={_values}
          proxyURL={proxyURL}
          setShowTest={setShowTest}
        />
      )}
    </div>
  );
};