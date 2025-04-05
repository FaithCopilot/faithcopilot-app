import { useState } from "react";

import MultiSelect from 'react-select'

import { Button } from "@/components/buttons/Button";
import { Label } from "@/components/fields/Label";
import { getKVId, KeyValue } from "@/components/fields/KeyValue";

import { ICON_SIZE, SaveIcon } from "@/components/Icons";

const mapValuesIn = (values) => {
  if (!values) return [];
  return values.map((entry) => {
    const id = getKVId();
    const [key, value] = Object.entries(entry)[0];
    return { id, key, value };
  });
};

const mapValuesOut = (values) => {
  if (!values) return [];
  return values.map((entry) => ({ [entry.key]: entry.value }));
};

/*
values = step definition
values: {
  assign: [
    { "key1": "value1" },
    { "key2": "value2" },
    ...
  ],
  register: ["key1", "key2"],
  ..., // other fields
}
*/
const VariableModule = ({ label, values, setValues, dismiss }) => {
  const [stepName, setStepName] = useState(values?.name ?? values?.call ?? '');
  const mappedAssign = mapValuesIn(values?.assign);
  const [_values, _setValues] = useState({
    ...values,
    assign: mappedAssign,
  });
  const options = _values?.assign?.map((entry) => ({ ...entry, label: entry?.key })) ?? [];
  const onSave = () => {
    const assign = mapValuesOut(_values?.assign);
    const register = _values?.register ?? [];
    setValues({
      ...values,
      name: stepName,
      assign,
      register,
    });
    dismiss();
  };
  return(
    <div className="flex flex-col justify-between"> 
      <div className="flex flex-col space-y-4">
        <Label label="Name" className="uppercase">
          <input
            type="text"
            value={stepName}
            onChange={(evt) => setStepName(evt.target.value)}
            className="inputs"
          />
        </Label>
        <Label label={label ?? "Vars"} className="uppercase">
          <KeyValue
            values={_values?.assign}
            onChangeValues={(__values) => _setValues({ ..._values, assign: __values })}
          />
        </Label>
        <Label label="Register" className="uppercase z-50" help={`
          Register any variables to make them configurable in the Faith Copilot Chat/Search UI.

          For example, "temperature" (for LLM/Chat) or "topK" (for Search), etc...
        `}>
          <MultiSelect
            isClearable={false}
            isMulti
            isSearchable
            options={options}
            value={options.filter((option) => _values?.register?.includes(option?.key) )}
            onChange={(selected) => {
              const selectedValues = selected.map(entry => entry.key);
              _setValues({
                ..._values,
                register: selectedValues,
              });
            }}
            menuPortalTarget={document.body}
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
            classNames={{
              control: (state) => "surfaces texts",
              menuList: () => "surfaces",
              option: () => "surfaces hover:backgrounds hover:cursor-pointer",
              multiValue: () => "backgrounds",
              multiValueLabel: () => "texts",
              input: () => "texts",
            }}
          />
        </Label>
      </div>
      <div className="flex flex-row space-x-2 ms-auto px-2 pt-4">
        <Button
          variant="link"
          label="Cancel"
          onClick={() => dismiss()}
        />
        <Button
          variant="primary"
          icon={<SaveIcon size={ICON_SIZE} />}
          label="Save"
          onClick={onSave}
        />
      </div>
    </div>
  );
};
export default VariableModule;