import { useEffect, useState } from "react";

import { CheckIcon } from "lucide-react";

type PropsType = {
  id?: string;
  idx?: number;
  checked?: boolean | undefined;
  disabled?: boolean;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>, idx?: number) => void;
  register?: any;
  className?: string;
};

export const Checkbox = ({
  id,
  idx,
  checked,
  disabled,
  onChange,
  register,
  className
}: PropsType) => {
  const [_checked, _setChecked] = useState<boolean | undefined>(checked);

  useEffect(() => {
    _setChecked(checked);
  }, [checked]);

  const _onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    _setChecked(evt.target.checked);
    if (onChange) {
      if (idx) {
        onChange?.(evt, idx);
      }
      onChange?.(evt);
    }
  };

  return (
    <div className="flex gap-2">
      <input
        id={id}
        disabled={disabled}
        type="checkbox"
        checked={_checked}
        onChange={_onChange}
        {...register?.(id, { onChange: _onChange })}
        className={[
          "relative peer shrink-0 appearance-none w-4 h-4 rounded-sm border-2 border-neutral-600 dark:border-neutral-300 checked:bg-primary-800 checked:border-0 checked:ring-2 checked:ring-primary-300 disabled:border-neutral-300 disabled:dark:border-neutral-700",
          disabled && checked
            ? "checked:ring-1 checked:ring-neutral-500 checked:dark:ring-neutral-500 disabled:bg-neutral-100 disabled:dark:bg-neutral-800"
            : "",
          className ?? ""
        ].join(" ")}
      />
      <CheckIcon
        size={16}
        className={[
          "absolute w-4 h-4 hidden peer-checked:block pointer-events-none text-neutral-50",
          disabled && checked ? "text-neutral-500 dark:text-neutral-500" : ""
        ].join(" ")}
      />
    </div>
  );
};
