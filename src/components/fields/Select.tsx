type SelectItemType = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export const Select = ({
  id,
  label,
  placeholder,
  items = [],
  value,
  onChange,
  register,
  className,
  disabled,
}: {
  id?: string;
  label?: string;
  placeholder?: string;
  items?: SelectItemType[];
  value?: string;
  onChange?: (value: string) => void;
  register?: any;
  className?: string;
  disabled?: boolean;
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="relative">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium mb-1 texts"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value || ''}
        onChange={handleChange}
        disabled={disabled}
        {...register?.(id)}
        className={[
          "w-full texts inputs",
          disabled ? "cursor-not-allowed opacity-50" : '',
          className ?? '',
        ].join(' ')}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {items?.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};