import { useEffect, useState } from "react";

import { MenuItem } from "./MenuItem";

import {
  ChevronDown,
  ChevronLeft, // TODO: RTL support
  ChevronRight
} from "lucide-react";

import type { SideBarItemType } from "@/components/SideBar";

export const SubMenu = ({
  defaultOpen,
  icon, // TODO: remove this prop
  startComponent,
  endComponent,
  label,
  href,
  items,
  onClick,
  children
}: {
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  startComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  label?: string;
  href?: string;
  items?: Array<SideBarItemType>;
  onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
  children?: React.ReactNode;
}) => {
  const [expanded, setExpanded] = useState<boolean | undefined>(defaultOpen);
  useEffect(() => {
    if (
      window?.location?.pathname &&
      href &&
      window.location.pathname?.includes(href)
    ) {
      setExpanded(true);
    }
    return;
  }, [href]);
  return (
    <>
      <MenuItem
        rounded
        startComponent={startComponent ?? icon}
        label={label ?? ""}
        onClick={() => setExpanded(!expanded)}
        endComponent={
          endComponent ?? (expanded ? <ChevronDown /> : <ChevronRight />)
        }
      />
      <ul
        className={["py-2 space-y-2 pl-4", expanded ? "block" : "hidden"].join(
          " "
        )}
      >
        {children}
        {items?.map((item: SideBarItemType, idx: number) => (
          <MenuItem
            rounded
            key={item?.label ? `${item.label}-${idx}` : idx}
            startComponent={item?.startComponent}
            endComponent={item?.endComponent}
            label={item?.label ?? ""}
            href={item?.href}
            onClick={item?.onClick}
          />
        ))}
      </ul>
    </>
  );
};
