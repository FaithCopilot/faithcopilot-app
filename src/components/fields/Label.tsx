import { HelpModal } from "@/components/modals/HelpModal";

const LabelConditional = ({
  htmlFor,
  label,
  subLabel
}: {
  htmlFor?: string;
  label: string;
  subLabel?: string;
}) => {
  if (!subLabel) return <label htmlFor={htmlFor}>{label}</label>;
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={htmlFor}>{label}</label>
      {subLabel && <span className="text-sm placeholders">{subLabel}</span>}
    </div>
  );
};

export const Label = ({
  htmlFor,
  label,
  subLabel,
  inline,
  end,
  help,
  className,
  children
}: {
  htmlFor?: string;
  label?: string;
  subLabel?: string;
  inline?: boolean;
  end?: boolean;
  help?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  if (inline) {
    return (
      <div
        className={[
          "flex flex-row space-x-2 items-start",
          className ?? ""
        ].join(" ")}
      >
        {!end && (
          <LabelConditional
            htmlFor={htmlFor}
            label={label}
            subLabel={subLabel}
          />
        )}
        <div className="py-1">{children}</div>
        {end && (
          <LabelConditional
            htmlFor={htmlFor}
            label={label}
            subLabel={subLabel}
          />
        )}
        {help && <HelpModal label={label} content={help} />}
      </div>
    );
  }
  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row space-x-2 items-start">
        <label
          htmlFor={htmlFor}
          className={["text-sm", className ?? ""].join(" ")}
        >
          {label}
        </label>
        {help && <HelpModal label={label} content={help} />}
      </div>
      {children}
    </div>
  );
};
