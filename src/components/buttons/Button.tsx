import { memo } from "react";

export const Button = memo(({
  disabled,
  label,
  onClick,
  type = "button",
  ref,
  variant,
  icon,
  iconStart,
  iconEnd,
  children,
  className
}: {
  disabled?: boolean;
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  ref?: React.RefObject<HTMLButtonElement>;
  variant?: "primary" | "surface" | "danger" | "outline" | "hover" | "link" | "none";
  icon?: React.ReactNode;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) => (
  <button
    ref={ref}
    type={type}
    onClick={onClick}
    className={[
      "flex flex-row space-x-2 p-2 rounded",
      label ? "px-4" : '',
      "text-black dark:text-white",
      "focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-600",
      icon && (!label && !children) && !iconStart && !iconEnd && "w-10 h-10",
      !variant &&
        "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600",
      variant === "none" && "ring-0",
      variant === "hover" && "ring-0 hover:ring-1 hover:rings",
      variant === "link" && "underline ring-0 hover:ring-0 hover:no-underline",
      variant === "outline" &&
        "ring-1 rings hover:ring-black dark:hover:ring-white",
      variant === "surface" &&
        "surfaces ring-1 rings hover:ring-black dark:hover:ring-white",
      variant === "danger" &&
        "bg-red-700 text-white dark:bg-red-700 ring-1 rings hover:bg-red-600 dark:hover-bg-red-600 hover:ring-red-800 dark:hover:ring-white focus:ring-black dark:focus:ring-white",
      variant === "primary" &&
        "bg-primary-800 text-white dark:bg-primary-800 ring-1 rings hover:bg-primary-600 dark:hover-bg-primary-600 hover:ring-primary-800 dark:hover:ring-white focus:ring-black dark:focus:ring-white",
      className ?? "",
      disabled && "opacity-50 pointer-events-none"
    ].join(" ")}
  >
    {(icon || iconStart) && (<div>{icon ?? iconStart}</div>)}
    {label && (<div>{label}</div>)}
    {children && (<div>{children}</div>)}
    {iconEnd && (<div>{iconEnd}</div>)}
  </button>
), (prevProps, nextProps) => {
  return(
    prevProps.disabled === nextProps.disabled &&
    prevProps.label === nextProps.label &&
    prevProps.onClick === nextProps.onClick &&
    prevProps.type === nextProps.type &&
    prevProps.variant === nextProps.variant &&
    //prevProps.icon === nextProps.icon &&
    //prevProps.iconStart === nextProps.iconStart &&
    //prevProps.iconEnd === nextProps.iconEnd &&
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className
  );
});
