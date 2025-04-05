import { useState } from "react";

import { getKVId } from "@/components/fields/KeyValue";

import { Label } from "@/components/fields/Label";
import { HTTPModule, BodyWithHelp } from "@/components/HTTPModule";

const mapValuesIn = (values) => {
  const mappedValues = { ...values };
  if (mappedValues?.headers) {
    mappedValues["headers"] = Object.entries(mappedValues["headers"]).map((entry) => {
      const id = getKVId();
      const [key, value] = entry;
      return { id, key, value };
    });
  };
  if (mappedValues?.searchParams) {
    mappedValues["searchParams"] = Object.entries(mappedValues["searchParams"]).map((entry) => {
      const id = getKVId();
      const [key, value] = entry;
      return { id, key, value };
    });
  };
  return mappedValues;
};

const mapHeaders = (headers) => {
  let mappedHeaders = {};
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

const mapValuesOut = (values) => {
  if (!values) return {};
  const mappedValues = { ...values };
  if (values?.headers) {
    mappedValues["headers"] = mapHeaders(values["headers"]);
  };
  return mappedValues;
};

/*
values = step definition
values: {
  args: {
    "url": "https://jsonplaceholder.typicode.com/posts",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{ \"title\": \"foo\", \"body\": \"bar\", \"userId\": 1 }"
    ...
  },
  ..., // other fields
}
*/
const WFHTTPModule = ({ label, values, setValues, dismiss }) => {
  const [stepName, setStepName] = useState(values?.name ?? values?.call ?? '');
  const [namedResult, setNamedResult] = useState(values?.result ?? '');
  const mappedValuesIn = mapValuesIn(values?.args);
  const [_values, _setValues] = useState(mappedValuesIn);
  const hasBody = _values?.body?.length > 0;
  const onSave = (__values) => {
    const mappedValuesOut = mapValuesOut(__values);
    setValues({
      ...values,
      name: stepName,
      args: mappedValuesOut,
      result: namedResult
    });
    dismiss();
  };
  return(
    <HTTPModule
      hasBody={hasBody}
      proxyURL="/v1/proxy"
      name={stepName}
      setName={setStepName}
      defaultValues={_values}
      onSave={onSave}
      dismiss={dismiss}
    >
      <div className="w-full md:w-1/2 flex flex-col space-y-8">
        { !hasBody && <BodyWithHelp /> }
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
    </HTTPModule>
  );
};
export default WFHTTPModule;