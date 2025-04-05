import { SideBar } from "@/components/SideBar";

import {
  CircleUserIcon,
  FileStackIcon,
  BlocksIcon,
  ExternalLinkIcon,
  FileBoxIcon
} from "lucide-react";

const SideBarConfig = ({ basePath }={}) => {
  return(
    <SideBar
      items={[
        {
          startComponent: <CircleUserIcon />,
          label: "Context",
          href: basePath,
        },
        {
          startComponent: <FileStackIcon />,
          label: "Documents",
          href: `${basePath}/documents`,
        },
        {
          startComponent: <BlocksIcon />,
          label: "Indexes",
          href: `${basePath}/indexes`,
        },
        {
          startComponent: <FileBoxIcon />,
          label: "Embeddings",
          href: `${basePath}/embeddings`,
        },
      ]}
    />
  );
};
export default SideBarConfig;
