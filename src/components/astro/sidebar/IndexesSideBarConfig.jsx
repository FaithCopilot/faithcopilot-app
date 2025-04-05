import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  IndexesIcon
} from "@/components/Icons";

const PREFIX = "/services/indexes";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Indexes Service",
          href: PREFIX,
        },
        { divider: true },
        {
          startComponent: <IndexesIcon size={ICON_SIZE} />,
          label: "Indexes",
          href: `${PREFIX}/list`,
        }
      ]}
    />
  );
};
export default SideBarConfig;
