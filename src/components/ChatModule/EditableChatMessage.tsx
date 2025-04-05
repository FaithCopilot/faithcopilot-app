import { useEffect, useState } from "react";

import { ButtonMenu } from "../ButtonMenu";
import { Button } from "../buttons/Button";
import { MarkdownRenderer } from "../MarkdownRenderer";
import { Modal } from "../modals/Modal";

import {
  BotMessageSquareIcon as AssistantIcon,
  UserCircleIcon as AvatarIcon,
  XIcon as ClearIcon,
  PencilIcon as EditIcon,
  CheckIcon as DoneIcon,
  CopyIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleHelpIcon,
  EllipsisIcon as ActionsIcon,
  TornadoIcon as MetadataIcon,
  XIcon,
  WandSparklesIcon
} from "lucide-react";

interface Metadata {
  [key: string]: string;
};

const getIcon = (message: any) => {
  if (message?.icon) return message.icon;
  if (message.role === "assistant") return <AssistantIcon />;
  if (message.role === "user") return <AvatarIcon />;
  return <CircleHelpIcon />;
};

const getStyle = (message: any) => {
  if (message.role === "assistant") {
    return "bg-neutral-900/30 dark:bg-neutral-900/70";
  };
  if (message.role === "user") {
    return "";
  };
  return "bg-neutral-900/10 dark:bg-neutral-900/50";
};

const renderValue = (value: any) => {
  // parse for URL and render as link
  if (typeof value === "string" && value.startsWith("http")) {
    return (
      <a href={value} target="_blank" rel="noreferrer" className="underline">
        {value}
      </a>
    );
  }
  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }
  return value;
};

const MetadataModal = ({
  metadata,
  open,
  onOpenChange,
  trigger
}: {
  metadata?: Metadata;
  open: boolean;
  onOpenChange: any;
  trigger?: any;
}) => {
  return (
    <Modal
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title="Metadata"
      content={
        <div className="flex flex-col space-y-4 max-h-[calc(65vh)] overflow-y-auto">
          {metadata &&
            Object?.entries(metadata)?.map(([key, value]) => (
              <div key={key}>
                <div className="font-bold">{key}</div>
                <div>{renderValue(value)}</div>
              </div>
            ))}
        </div>
      }
      trigger={trigger}
    />
  );
};

const Score = ({ score }: { score?: number }) => {
  if (!score || typeof score !== "number") return null;
  return <div className="bg-neutral-950/50 text-white py-3 px-2 rounded-lg font-bold">{score.toFixed(2)}</div>;
};

export const EditableChatMessage = ({
  collapsible,
  idx,
  messages,
  setMessages,
  messageOptions,
}: {
  collapsible?: boolean;
  idx: number;
  messages: any;
  setMessages: (message: any) => void;
  messageOptions?: (message: any, setMessage: any) => Array<any>;
}) => {
  const [edit, setEdit] = useState<string|null|undefined>();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showMetadataModal, setShowMetadataModal] = useState<boolean>(false);

  const message = messages?.[idx];
  const setMessage = (_message: any) => {
    const _messages = [...messages];
    _messages[idx] = _message;
    setMessages(_messages);
  };

  // TODO: constants
  const isSystem = message?.role === "system";
  const isUser = message?.role === "user";
  const isAssistant = message?.role === "assistant";
  const isContext = message?.role === "context";
  const isSafety = message?.role === "safety";

  const icon = getIcon(message);
  const style = getStyle(message);

  const processedMessageOptions = messageOptions?.(message, setMessage) ?? [];

  useEffect(() => {
    // auto-expand first and last messages, if "assistant" role
    if (isAssistant && (idx === 0 || messages?.length-1 === idx)) {
      setExpanded(true);
    };
    return;
  }, [messages?.length, idx]);

  // TODO: memoize
  const ActionsButtonMenu = ({ message }: { message: any }) => {
    const conditionalMessageOptions = [];
    if (message?.metadata) {
      conditionalMessageOptions.push({
        icon: <MetadataIcon />,
        label: "View Metadata",
        onClick: () => setShowMetadataModal(true)
      });
    };
    return (
      <ButtonMenu
        title={typeof message?.content === "string" ? `"${message?.content?.substring(0, 25)}..."` : ''}
        variant="none"
        items={[
          ...conditionalMessageOptions,
          {
            icon: <CopyIcon />,
            label: "Copy Message",
            onClick: () => navigator.clipboard.writeText(message.content)
          },
          {
            icon: <EditIcon />,
            label: "Edit Message",
            onClick: () => {
              setExpanded(true);
              setEdit(message?.content);
            }
          },
          {
            icon: <XIcon />,
            label: "Delete Message",
            onClick: () => setMessages(messages.filter((_: any, _idx: number) => _idx !== idx))
          },
          /*
          {
            icon: <WandSparklesIcon />,
            label: "Summarize Message",
            //onClick: () => console.log("Summarize Message")
          },
          */
          ...processedMessageOptions
        ]}
        icon={<ActionsIcon />}
      />
    );
  };

  if (!message || !(isUser || isAssistant || isContext || isSafety)) {
    return null;
  };

  return (
    <div
      className={[
        "p-4",
        idx === 0 ? "border-t-2 " : "",
        "border-b-2 border-primary-800 dark:border-primary-900",
        style
      ].join(" ")}
    >
      <div className="flex items-start max-w-2xl mx-auto space-x-4">
        {icon}
        {!expanded && message.content?.length > 100 && collapsible ? (
          <div className="w-full flex flex-row space-x-1">
            <div className="min-w-[200px] md:grow text-sm sm:text-base texts">
              {message.content.substring(0, 100)}...{" "}
              <a onClick={() => setExpanded(true)}>more</a>
            </div>
            <div className="w-[200px] flex flex-col space-y-1 justify-start items-center md:flex-row md:space-x-1 md:justify-center md:items-start">
              <Score score={message?.score} />
              <ActionsButtonMenu message={message} />
              <div className="w-12">
                <Button
                  variant="none"
                  icon={<ChevronDownIcon />}
                  onClick={() => setExpanded(true)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-row space-x-2">
            <div className="min-w-[200px] md:grow text-sm sm:text-base texts">
              { edit ? (
                <textarea
                  value={edit}
                  onChange={(evt) => setEdit(evt.target.value)}
                  className="w-full ms-auto h-20 p-2 rounded-md rings focused surfaces"
                />
              ) : (
                <div className="min-w-[200px]">
                  {<MarkdownRenderer>{message.content}</MarkdownRenderer>}
                </div>
              )}
            </div>
            { edit ? (
              <div className="w-[200px] flex flex-col space-y-1 justify-start items-center md:flex-row md:space-x-1 md:justify-center md:items-start">
                <Button
                  variant="none"
                  icon={<DoneIcon />}
                  onClick={() => {
                    setMessage({ ...message, content: edit });
                    setEdit(null);
                  }}
                />
                <Button
                  variant="none"
                  icon={<ClearIcon />}
                  onClick={() => setEdit(null)}
                />
              </div>
            ) : (
              <div className="w-[200px] flex flex-col space-y-1 justify-start items-center md:flex-row md:space-x-1 md:justify-center md:items-start">
                <Score score={message?.score} />
                <ActionsButtonMenu message={message} />
                {expanded && (
                  <Button
                    variant="none"
                    icon={<ChevronUpIcon />}
                    onClick={() => setExpanded(false)}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showMetadataModal && (
        <MetadataModal
          metadata={message?.metadata}
          open={showMetadataModal}
          onOpenChange={setShowMetadataModal}
        />
      )}
    </div>
  );
};
