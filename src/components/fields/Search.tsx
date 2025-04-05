import { useState } from "react";

import { Button } from "@/components/buttons/Button";
import { DebouncedInput } from "@/components/fields/DebouncedInput";

import {
  ICON_SIZE,
  SearchIcon,
  FilterIcon,
  XIcon
} from "@/components/Icons";

declare interface IFilter {
  [key: string]: any;
}

export const Search = ({
  value,
  onChange,
  debounce = 500,
  filter,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  filter?: IFilter;
}) => {
  const [_value, _setValue] = useState(value);
  const _onChange = (value: string) => {
    _setValue(value);
    if (onChange) {
      onChange(value);
    }
    return;
  };
  return (
    <div
      className={[
        "flex flex-row space-x-2 p-1 ps-2 items-center w-full rounded",
        "bg-white dark:bg-black",
        "border border-neutral-400 dark:border-neutral-600"
      ].join(" ")}
    >
      <SearchIcon size="20" />
      {filter && (
        <Button
          variant="none"
          onClick={() => console.log("*** FILTER")}
          iconStart={<FilterIcon size="20" />}
        />
      )}
      <DebouncedInput
        {...props}
        value={_value}
        onChange={_onChange}
        className={[
          "w-full p-1 bg-white dark:bg-black",
          //"focus:border-0 focus:ring-primary-400 dark:focus:ring-primary-600",
          "border-0 focus:ring-0"
        ].join(" ")}
      />
      {_value?.length > 0 && (
        <Button
          variant="none"
          icon={<XIcon size="20" />} onClick={() => _onChange("")}
        />
      )}
    </div>
  );
};
