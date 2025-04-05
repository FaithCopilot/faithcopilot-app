import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  AccessIcon,
  ChatIcon,
  ModelsIcon,
  SearchIcon
} from "@/components/Icons";

const PREFIX = "/services";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Services",
          href: PREFIX,
        },
        { divider: true },
        {
          startComponent: <AccessIcon size={ICON_SIZE} />,
          label: "Access",
          href: `${PREFIX}/access`,
        },
/*
        {
          startComponent: <FlipHorizontal2Icon />,
          label: "Align",
          href: `${PREFIX}/align`,
        },
*/
        {
          startComponent: <ChatIcon size={ICON_SIZE} />,
          label: "Chat",
          href: `${PREFIX}/chat`,
        },
/*
        {
          startComponent: <CircleFadingPlusIcon />,
          label: "Context",
          href: `${PREFIX}/context`,
        },
        {
          startComponent: <DataIcon size={ICON_SIZE} />,
          label: "Data",
          href: `${PREFIX}/data`,
        },
        {
          startComponent: <IndexesIcon size={ICON_SIZE} />,
          label: "Indexes",
          href: `${PREFIX}/indexes`,
        },
*/
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Models",
          href: `${PREFIX}/models`,
        },
/*
        {
          startComponent: <SafetyIcon size={ICON_SIZE} />,
          label: "Safety", // TODO: translate
          href: `${PREFIX}/safety`,
        },
*/
        {
          startComponent: <SearchIcon size={ICON_SIZE} />,
          label: "Search", // TODO: translate
          href: `${PREFIX}/search`,
        },
/*
        {
          startComponent: <WorkflowIcon size={ICON_SIZE} />,
          label: "Workflows", // TODO: translate
          href: `{PREFIX}/workflows`,
        }
*/
      ]}
    />
  );
};
export default SideBarConfig;