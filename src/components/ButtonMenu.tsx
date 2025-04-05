import { useState } from "react";

import { Button } from "@/components/buttons/Button";
import { Popover } from "@/components/Popover";
import { MenuItem, MenuItemDivider } from "@/components/menus/MenuItem";

import { ICON_SIZE, ActionsIcon } from "@/components/Icons";

const truncate = (value: string, len: number) => value;

interface IButtonMenuClassNames {
  button?: string;
  popover?: string;
};

export const ButtonMenu = ({
  pill,
  variant,
  offset,
  icon,
  iconStart,
  iconEnd,
  title,
  items,
  classNames
}: {
  pill?: boolean;
  variant?: any;
  offset?: number;
  icon?: React.ReactNode;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  title?: string;
  items?: Array<object>;
  classNames?: IButtonMenuClassNames;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  return(
    <Popover
      offset={offset}
      isOpen={open}
      onClose={()=>setOpen(false)}
      content={(
        <div className={[
          classNames?.popover ?? ""
        ].join()}>
          {title && (
            <div>
              <span className="mx-2 font-bold">{truncate(title ?? "", 20)}</span>
              <MenuItemDivider />
            </div>
          )}
          {items?.map((action: any, idx: number) => (
            <MenuItem
              key={action?.label ? `$action.label}-${idx}` : idx}
              startComponent={action?.icon}
              //endComponent={<Indicator relative alert={action?.alert} />}
              label={action?.label}
              onClick={action?.onClick}
              href={action?.href}
              dismiss={() => setOpen(false)}
            />
          ))}
        </div>
      )}
      >
        <div>
          {iconStart && iconEnd && (
            <Button
              type="button"
              onClick={() => setOpen(!open)}
              variant={variant}
              iconStart={iconStart}
              iconEnd={iconEnd}
              className={
                classNames?.button ??
                [
                  "flex flex-row justify-center items-center rounded px-4 py-2",
                  "bg-white text-black dark:bg-black dark:text-white",
                  "ring-1 ring-neutral-400 dark:ring-neutral-600 active:ring-pink-600 dark:active:ring-pink-400",
                  pill ? "rounded-full" : ""
                ].join(" ")
              }
            />
          )}
          {!(iconStart && iconEnd) && (
            <Button
              type="button"
              onClick={() => setOpen(!open)}
              variant={variant}
              icon={icon ?? <ActionsIcon size={ICON_SIZE} />}
            />
          )}
        </div>
    </Popover>
  );
};