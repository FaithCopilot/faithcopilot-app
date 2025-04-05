import React, { useEffect, useState } from "react";

import { ButtonMenu } from "@/components/ButtonMenu";

import { CircleUserIcon, MenuIcon } from "lucide-react";

const NavLink = ({
  href,
  icon,
  label,
  url
}: {
  href: string;
  icon?: React.ReactNode;
  label: string;
  url?: string;
}) => {
  const [selected, setSelected] = useState<boolean>(false);
  useEffect(() => {
    // pass in from Astro.request.url (to avoid window/document issue)
    if (url) {
      const urlPathname = new URL(url)?.pathname;
      if (urlPathname === href) {
        setSelected(true);
      };
      return;
    };
    // for typical non-Astro use
    // Astro requires:
    // - <NavBar client:load ... />, or later versions
    // - <NavBar client:only="react" ... />, results in a delayed render :(
    if (window) {
      if (window?.location?.pathname === href) {
        setSelected(true);
      };
    };
    return;
  }, [url]);
  return (
    <a href={href} className="no-link">
      <div
        className={[
          "flex flex-row space-x-2 justify-center text-primary-300 font-bold rounded py-1 px-2 hover:bg-primary-950 hover:text-neutral-50",
          selected ? "bg-primary-950" : ""
        ].join(" ")}
      >
        {icon}
        <span className="text-sm md:text-xl">{label}</span>
      </div>
    </a>
  );
};

const AccountMenu = ({
  items,
  account
}: {
  items: Array<INavBarItem>;
  account: any;
}) => {
  return (
    <ButtonMenu
      pill
      variant="surface"
      title={account?.email}
      iconStart={<MenuIcon />}
      iconEnd={<CircleUserIcon />}
      items={items}
    />
  );
};

interface INavBarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  account: any;
  onClick?: () => void;
}

export const NavBar = ({
  brandName,
  withMenu,
  url,
  account,
  accountItems,
  appItems
}: {
  brandName: string;
  withMenu?: boolean;
  url?: string;
  account?: any;
  accountItems?: Array<INavBarItem>;
  appItems?: Array<INavBarItem>;
}) => {
  return (
    <div className="fixed shadow-md z-50 w-full bg-primary-800 py-1 h-12 md:pt-3 md:h-16">
      <div className="flex items-center px-2 w-screen">
        <div className="flex flex-row space-x-2 items-center">
          <a
            href="/"
            className="underline cursor-pointer hover:no-underline text-primary-300 font-bold text-lg md:text-3xl"
          >
            {brandName}
          </a>
        </div>
        <>
          <div className="hidden md:flex flex-row space-x-2 lg:space-x-4 ps-4 lg:ps-8 pe-8">
            {appItems?.map((item: any, idx: number) => (
              <NavLink
                key={item.href ? `${item.href}-${idx}` : idx}
                url={url}
                {...item}
              />
            ))}
          </div>
          <div className="hidden md:flex ms-auto">
            {withMenu && (
              <AccountMenu items={accountItems ?? []} account={account} />
            )}
          </div>
          <div className="flex md:hidden ms-auto">
            {withMenu && (
              <AccountMenu
                items={[...(appItems ?? []), ...(accountItems ?? [])]}
                account={account}
              />
            )}
          </div>
        </>
      </div>
    </div>
  );
};
