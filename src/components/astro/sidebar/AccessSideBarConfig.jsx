import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  UserIcon,
  GroupIcon,
  PoliciesIcon,
  APIKeysIcon,
  EnvIcon
} from "@/components/Icons";

const PREFIX = "/services/access";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Access Service",
          href: PREFIX,
        },
        {
          startComponent: <UserIcon size={ICON_SIZE} />,
          label: "Users",
          href: `${PREFIX}/users`,
        },
        {
          startComponent: <GroupIcon size={ICON_SIZE} />,
          label: "Groups",
          href: `${PREFIX}/groups`,
        },
        {
          startComponent: <PoliciesIcon size={ICON_SIZE} />,
          label: "Policies",
          href: `${PREFIX}/policies`,
        },
        {
          startComponent: <APIKeysIcon size={ICON_SIZE} />,
          label: "API Keys",
          href: `${PREFIX}/api-keys`,
        },
        { divider: true },
        {
          startComponent: <EnvIcon size={ICON_SIZE} />,
          label: "Environment",
          href: `${PREFIX}/env`,
        },
      ]}
    />
  );
};
export default SideBarConfig;