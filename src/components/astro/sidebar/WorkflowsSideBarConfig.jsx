import { SideBar } from "@/components/SideBar";

import {
  WorkflowIcon,
  WaypointsIcon,
  MonitorDotIcon,
} from "lucide-react";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <WorkflowIcon />,
          label: "Workflows",
          href: "/admin/workflows",
        },
        {
          startComponent: <WaypointsIcon />,
          label: "Manage",
          href: "/admin/workflows/manage",
        },
        {
          startComponent: <MonitorDotIcon />,
          label: "Monitoring",
          href: "/admin/workflows/monitoring",
        },
      ]}
      className="p-2 rounded-lg w-full md:w-[300px]"
    />
  );
};
export default SideBarConfig;
