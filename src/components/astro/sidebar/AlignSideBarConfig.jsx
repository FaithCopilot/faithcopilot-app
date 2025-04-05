import { SideBar } from "@/components/SideBar";

import {
  FlipHorizontal2Icon,
  CircleUserIcon,
  DatabaseIcon,
  PackageIcon,
  RouterIcon
} from "lucide-react";

import {
  ServicesIcon
} from "@/components/Icons";

const PREFIX = "/services/align";
const ICON_SIZE = 24;

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Align Service",
          href: PREFIX,
        },
        { divider: true },
        {
          startComponent: <DatabaseIcon />,
          label: "Datasets",
          href: `${PREFIX}/datasets`,
        },
        {
          startComponent: <PackageIcon />,
          label: "Models",
          href: `${PREFIX}/models`,
        },
        {
          startComponent: <RouterIcon />,
          label: "Serve",
          href: `${PREFIX}/serve`,
        },
      ]}
      //className="p-2 rounded-lg w-full md:w-[300px]"
    />
  );
};
export default SideBarConfig;
