import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  ServicesIcon,
  RulesIcon,
  GuardrailsIcon,
  JudgementIcon
} from "@/components/Icons";

const PREFIX = "/services/safety";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ServicesIcon size={ICON_SIZE} />,
          label: "Safety Service",
          href: PREFIX,
        },
        {
          startComponent: <RulesIcon size={ICON_SIZE} />,
          label: "Rules",
          href: `${PREFIX}/rules`,
        },
        {
          startComponent: <GuardrailsIcon size={ICON_SIZE} />,
          label: "Guardrails",
          href: `${PREFIX}/guardrails`,
        },
        {
          startComponent: <JudgementIcon size={ICON_SIZE} />,
          label: "Judgement",
          href: `${PREFIX}/judgements`,
        },
      ]}
    />
  );
};
export default SideBarConfig;
