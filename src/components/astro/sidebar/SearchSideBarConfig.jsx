import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  ProfilesIcon,
  SessionsIcon
} from "@/components/Icons";

const PREFIX = "/services/search";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Search Service",
          href: PREFIX,
        },
        {
          startComponent: <ProfilesIcon size={ICON_SIZE} />,
          label: "Profiles",
          href: `${PREFIX}/profiles`,
        },
        {
          startComponent: <SessionsIcon size={ICON_SIZE} />,
          label: "Sessions",
          href: `${PREFIX}/sessions`,
        },
      ]}
    />
  );
};
export default SideBarConfig;
