import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  DataIcon,
  IntegrationsIcon
} from "@/components/Icons";

const PREFIX = "/services/data";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Data Services",
          href: PREFIX,
        },
        {
          startComponent: <DataIcon size={ICON_SIZE} />,
          label: "Data",
          href: `${PREFIX}/list`,
        },
        {
          divider: true
        },
        {
          startComponent: <IntegrationsIcon size={ICON_SIZE} />,
          label: "Integrations",
          href: `${PREFIX}/integrations`,
        },
      ]}
    />
  );
};
export default SideBarConfig;
