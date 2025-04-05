import { NavBar } from "@/components/NavBar";

import { useTranslations } from "@/hooks/use-i18n";
import { useRequest } from "@/hooks/use-request";

import { logout } from "@/api/auth";

import { Dictionary } from "@/i18n";

// TODO: refactor to Icons
import {
  CircleHelpIcon,
  CircleUserIcon,
  LogOutIcon,
  MessageCircleMoreIcon,
  MicIcon,
  SearchIcon,
  GripIcon
} from "lucide-react";

const NavBarConfig = ({ brandName, withMenu }={}) => {
  const { data: account } = useRequest("/v1/account");
  const { t } = useTranslations({ dictionary: Dictionary });
  const accountItems = [
    {
      icon: (<CircleUserIcon />),
      label: 'Account',
      // TODO: constant
      href: '/account',
      //href: RouteConstants.ACCOUNT
    },
    {
      icon: (<CircleHelpIcon />),
      label: 'Help / Support',
      href: '/support',
    },
    {
      icon: (<LogOutIcon />),
      label: 'Logout',
      onClick: () => logout(), // use fetcher to handle redirect
    },
  ]

  const appItems = [
    {
      icon: (<GripIcon />),
      label: t("nav.services"),
      href: '/services',
    },
    {
      icon: (<SearchIcon />),
      label: t("nav.search"),
      href: '/search',
    },
    {
      icon: (<MessageCircleMoreIcon />),
      label: t("nav.chat"),
      href: '/chat',
    },
/*
    {
      icon: (<MicIcon />),
      //label: t("nav.voice"),
      label: "Voice",
      href: '/voice',
    }
*/
  ];
  return(
    <NavBar
      brandName={brandName}
      withMenu={withMenu}
      account={account}
      accountItems={accountItems}
      appItems={appItems}
    />
  )
};
export default NavBarConfig;
