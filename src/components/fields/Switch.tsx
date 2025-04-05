import { useEffect, useState } from "react";

// TODO: merge with Checkbox component?
export const Switch = ({
  id,
  disabled,
  checked,
  onChange,
  register
} //className
: {
  id?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  register?: any;
  //className?: string;
}) => {
  const [_checked, _setChecked] = useState<boolean>(checked ?? false);

  useEffect(() => {
    _setChecked(checked ?? false);
  }, [checked]);

  const _onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    _setChecked(evt.target.checked);
    onChange?.(evt);
  };

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <div className="relative">
        <input
          id={id}
          disabled={disabled}
          type="checkbox"
          checked={_checked}
          onChange={_onChange}
          {...register?.(id, { onChange: _onChange })}
          className="sr-only"
        />
        <div
          className={[
            "ring-1 ring-primary-800 block w-14 h-8 rounded-full",
            _checked ? "bg-primary-800" : "bg-neutral-400 dark:bg-neutral-700"
          ].join(" ")}
        ></div>
        <div
          className={[
            "absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-200 ease-in-out",
            _checked ? "translate-x-6 bg-white" : "bg-neutral-800 dark:bg-white"
          ].join(" ")}
        ></div>
      </div>
    </label>
  );
};
