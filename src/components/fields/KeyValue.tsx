import { Button } from "@/components/buttons/Button";

import { PlusIcon, MinusIcon } from "@/components/Icons";

type KeyValueType = {
  id: string;
  key: string;
  value: string;
};

export const getKVId = () => Math.random().toString(36).substring(2,8);

export const KeyValue = ({
  readOnly = false,
  values = [],
  onChangeValues,
  className
}: {
  readOnly?: boolean;
  values: KeyValueType[];
  onChangeValues: (values: KeyValueType[]) => void;
  className?: string;
}) => {
  const handleAdd = () => {
    const randomIdx = getKVId();
    const currentValues = Array.isArray(values) ? values : [];
    onChangeValues([...currentValues, { id: randomIdx, key: "", value: "" }]);
  };

  const handleRemove = (kv: KeyValueType) => {
    const currentValues = Array.isArray(values) ? values : [];
    onChangeValues(currentValues.filter((item) => item.id !== kv.id));
  };

  const handleChange = (kv: KeyValueType) => {
    const currentValues = Array.isArray(values) ? values : [];
    const _values = [...currentValues];
    const idx = _values.findIndex((item) => item.id === kv.id);
    if (idx !== -1) {
      _values[idx] = kv;
      onChangeValues(_values);
    }
  };

  if ((!Array.isArray(values) || values.length === 0) && !readOnly) {
    return <Button variant="primary" icon={<PlusIcon size={24} />} onClick={handleAdd} />;
  };

  return (
    <div className={`flex flex-col space-y-2 w-full ${className || ''}`}>
      {values.map((_value: KeyValueType) => {
        const kv = { ..._value };
        if (!kv?.id) kv["id"] = getKVId();
        const { id, key, value } = kv;
        return (
          <div key={id} className="flex flex-col md:flex-row md:space-x-2">
            <input
              readOnly={readOnly}
              type="text"
              value={key}
              placeholder="Key"
              onChange={(evt) => handleChange({ ...kv, key: evt.target.value })}
              className="inputs w-full md:w-1/2 p-2 border rounded"
            />
            <input
              readOnly={readOnly}
              type="text"
              value={value}
              placeholder="Value"
              onChange={(evt) => handleChange({ ...kv, value: evt.target.value })}
              className="inputs w-full md:w-1/2 p-2 border rounded"
            />
            { !readOnly && (
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleRemove(kv)}
              >
                <MinusIcon size={16} />
              </button>
            )}
          </div>
        );
      })}
      { !readOnly && (
        <Button variant="primary" icon={<PlusIcon size={24} />} onClick={handleAdd} />
      )}
    </div>
  );
};