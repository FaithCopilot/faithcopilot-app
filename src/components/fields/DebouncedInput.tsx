import { useEffect, useState } from "react";

export const DebouncedInput = ({
  value,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string;
  onChange: (value: any) => void;
  debounce?: number;
  [key: string]: string | number | ((value: any) => void) | null | undefined;
}) => {
  const [_value, _setValue] = useState<string>(value);

  useEffect(() => {
    _setValue(value);
    return;
  }, [value]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(_value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [_value]);

  return (
    <input
      {...props}
      value={_value}
      onChange={(e) => _setValue(e.target.value)}
    />
  );
};
export default DebouncedInput;
