import { Menu, MenuItem, MenuItemDivider, SubMenu } from "@/components/menus";

export type SideBarItemType = {
  divider?: boolean;
  defaultOpen?: boolean;
  label?: string;
  startComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  onClick?: (evt: React.MouseEvent<HTMLAnchorElement>) => void;
  items?: Array<SideBarItemType>;
};

export const SideBar = ({
  fixed,
  items,
  className
}: {
  fixed?: boolean;
  items: Array<SideBarItemType>;
  className?: string;
}) => {
  return (
    <Menu
      className={[
        fixed ? "fixed top-0 bottom-0 overflow-y-auto" : "p-2",
        "w-full md:w-1/6 min-w-[275px]",
        className
      ].join(" ")}
    >
      {items.map((item: SideBarItemType, idx: number) => {
        const key = item?.label ? `${item.label}-${idx}` : idx;
        if (item?.divider === true) {
          return <MenuItemDivider key={key} />;
        }
        if (item?.items && item.items?.length > 0) {
          return (
            <SubMenu
              key={key}
              defaultOpen={item?.defaultOpen}
              icon={item?.icon}
              label={item?.label}
              items={item?.items}
              href={item?.href}
            />
          );
        }
        return (
          <MenuItem
            key={key}
            rounded
            startComponent={item?.startComponent}
            endComponent={item?.endComponent}
            label={item?.label ?? ""}
            href={item?.href}
            onClick={item?.onClick}
          />
        );
      })}
      <div className={fixed ? "md:h-screen" : ""}></div>
    </Menu>
  );
};
