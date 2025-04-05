import { useEffect, useState } from "react";

export const MenuItemDivider = ({ width }: { width?: string }) => (
  <hr
    className={`border border-bottom-1 border-neutral-400 dark:border-neutral-600 my-2 ${
      width ?? "w-full"
    }`}
  />
);

export const MenuItem = ({
  //selected,
  rounded,
  startComponent,
  label,
  endComponent,
  onClick,
  href,
  dismiss,
  containerClass,
  itemClass
}: {
  //selected?: boolean
  rounded?: boolean;
  startComponent?: React.ReactNode;
  label: string;
  endComponent?: React.ReactNode;
  onClick?: Function | null | undefined;
  href?: string | null | undefined;
  dismiss?: Function | null | undefined;
  containerClass?: string;
  itemClass?: string;
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (window?.location?.pathname && href) {
      const pathname = window.location.pathname;
      setSelected(pathname?.endsWith(href) || pathname?.endsWith(href + "/"));
    }
    return;
  }); // NOTE: run this effect on every render

  const _onClick = (): void => {
    if (onClick) {
      onClick();
    }
    if (dismiss) {
      dismiss();
    }
    return;
  };

  return (
    <a
      href={onClick ? undefined : selected || !href ? undefined : href}
      onClick={onClick ? _onClick : undefined}
      className={[
        "flex p-2 cursor-pointer",
        "text-black dark:text-white",
        href || onClick ? "hovers" : "",
        rounded ? "rounded-lg" : "",
        containerClass ?? "",
        selected ? "backgrounds pointer-events-none" : "",
        "no-underline"
      ].join(" ")}
    >
      <li className={["flex grow items-center", itemClass ?? ""].join(" ")}>
        <div className="flex-none">{startComponent}</div>
        <div className="grow ml-4">{label}</div>
        <div className="flex-none">{endComponent}</div>
      </li>
    </a>
  );
};
