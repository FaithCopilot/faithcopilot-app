import { SideBar } from "@/components/SideBar";

import {
  CircleUserIcon,
  LineChartIcon,
  ReceiptCentIcon,
  Columns3Icon,
  FileClockIcon,
  WalletCardsIcon,
  BanIcon,
  SettingsIcon,
  PaletteIcon,
  BellIcon,
  SquareUserIcon,
  EyeOffIcon,
  ShieldCheckIcon,
  CodeIcon,
  KeyRoundIcon,
  AppWindowIcon,
  WebhookIcon
} from "lucide-react";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <CircleUserIcon />,
          label: "Account",
          href: "/account",
        },
/*
        {
          startComponent: <LineChartIcon />,
          label: "Analytics",
          href: "/account/analytics",
        },
*/
        {
          icon: <SettingsIcon />,
          label: "Settings",
          href: "/account/settings",
          items: [
            {
              startComponent: <PaletteIcon />,
              label: "Appearance",
              href: "/account/settings/appearance",
            },
            /*
            {
              startComponent: <BellIcon />,
              label: "Notifications",
              href: "/account/settings/notifications",
            },
            {
              startComponent: <SquareUserIcon />,
              label: "Profile",
              href: "/account/settings/profile",
            },
            */
            {
              startComponent: <EyeOffIcon />,
              label: "Privacy",
              href: "/account/settings/privacy",
            },
            /*
            {
              startComponent: <ShieldCheckIcon />,
              label: "Security",
              href: "/account/settings/security",
            },
            */
          ],
        }
      ]}
      className="p-2 rounded-lg w-full md:w-[300px]"
    />
  );
};
export default SideBarConfig;
