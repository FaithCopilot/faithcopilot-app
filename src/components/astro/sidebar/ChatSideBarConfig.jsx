import { SideBar } from "@/components/SideBar";

import {
  ICON_SIZE,
  AppIcon,
  ChatIcon,
  ProfilesIcon,
  SessionsIcon,
  FeedbackIcon,
  EmailAgentsIcon,
  ChatWidgetsIcon
} from "@/components/Icons";

const PREFIX = "/services/chat";

const SideBarConfig = () => {
  return(
    <SideBar
      items={[
        {
          startComponent: <ChatIcon size={ICON_SIZE} />,
          label: "Chat Service",
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
        {
          startComponent: <FeedbackIcon size={ICON_SIZE} />,
          label: "Feedback",
          href: `${PREFIX}/feedback`,
        },
        {
          divider: true
        },
        {
          startComponent: <ChatWidgetsIcon size={ICON_SIZE} />,
          label: "Chat Widgets",
          href: `${PREFIX}/widgets`,
        },
        {
          startComponent: <EmailAgentsIcon size={ICON_SIZE} />,
          label: "Email Agents",
          href: `${PREFIX}/email-agents`,
        },
        {
          startComponent: <AppIcon size={ICON_SIZE} />,
          label: "Hosted Apps",
          href: `${PREFIX}/apps`,
        },
      ]}
    />
  );
};
export default SideBarConfig;
