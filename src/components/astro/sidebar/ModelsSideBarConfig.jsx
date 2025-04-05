import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  BinaryIcon,
  EndpointsIcon,
  ModelsIcon,
  ServicesIcon
} from "@/components/Icons";

const PREFIX = "/services/models";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Models Service",
          href: PREFIX,
        },
/*
        {
          startComponent: <BinaryIcon size={ICON_SIZE} />,
          label: "Embedding",
          href: `${PREFIX}/embedding`,
        },
*/
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Language",
          href: `${PREFIX}/language`,
        },
/*
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Vision",
          href: `${PREFIX}/vision`,
        },
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Audio",
          href: `${PREFIX}/audio`,
        },
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Multimodal",
          href: `${PREFIX}/multimodal`,
        },
        {
          startComponent: <ModelsIcon size={ICON_SIZE} />,
          label: "Other",
          href: `${PREFIX}/other`,
        },
*/
        { divider: true },
        {
          startComponent: <EndpointsIcon size={ICON_SIZE} />,
          label: "Endpoints",
          href: `${PREFIX}/endpoints`,
        },
      ]}
      //className="p-2 rounded-lg w-full md:w-[300px]"
    />
  );
};
export default SideBarConfig;
