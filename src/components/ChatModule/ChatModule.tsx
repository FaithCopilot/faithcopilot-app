import { useCallback, useEffect, useRef, useState } from "react";

import { ChatMessages } from "./ChatMessages";
import { FeedbackButtons } from "./FeedbackButtons";
import { MultilineInput } from "../MultilineInput";
import { ButtonMenu } from "../ButtonMenu";
import { Button } from "../buttons/Button";
import { Select } from "../fields/Select";
import { Label } from "../fields/Label";
import { Modal } from "../modals/Modal";

import { Toaster, toast } from "../Toast";

import {
  PlusIcon,
  SettingsIcon,
  XIcon,
  EllipsisIcon as ActionsIcon,
  CopyMinusIcon as CloseIcon,
  CopyPlusIcon as DuplicateIcon,
  CloudUploadIcon as SaveIcon,
  ComputerIcon as SystemIcon,
  MedalIcon
} from "lucide-react";

import type { ChatModuleType } from "./types";

const SystemMessageModal = ({
  open,
  onOpenChange,
  chat,
  setChat,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chat: any;
  setChat: any;
}) => {
  const [value, setValue] = useState<string>('');
  useEffect(() => {
    setValue(chat?.options?.systemMessage);
  }, [chat?.options?.systemMessage]);
  // set default system message from model, if not already set
  useEffect(() => {
    if (chat?.options?.systemMessage === undefined) {
      setChat({ ...chat, options: { ...chat.options, systemMessage: chat?.options?.model?.systemMessage }});
    };
    return;
  }, [chat?.options?.systemMessage, chat?.options?.model?.systemMessage]);
  return(
    <Modal
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title="System Message"
      content={(
        <textarea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          className="inputs w-full h-[calc(100vh-200px)]"
        />
      )}
      cancel
      footer={(
        <Button
          type="button"
          onClick={() => {
            setChat({ ...chat, options: { ...chat.options, systemMessage: value }});
            onOpenChange(false);
          }}
        >
          Update
        </Button>
      )}
    />
  );
};

const ConfigureSettingsModal = ({
  open,
  onOpenChange,
  type,
  chat,
  setChat,
  idx
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  chat: any;
  setChat: any;
  idx?: number;
}) => {
  const [_chat, _setChat] = useState<ChatModuleType>(chat);
  useEffect(() => {
    _setChat(chat);
  }, [chat]);
  const _model = _chat?.options?.model ?? {};
  const modelProvider = _model?.provider;
  //if (!_model || !modelProvider) return null;
  const _isIndex = (
    _model?.provider === "upstash" ||
    _model?.provider === "pinecone"
  );
  return(
    <Modal
      size="md"
      open={open}
      onOpenChange={onOpenChange}
      title="Configure Settings"
      content={(
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row space-x-4">
            <div>
              {`${type} #${idx ?? 0 + 1}`}
            </div>
            <div className="font-bold">
              {_chat?.options?.model?.label ?? ''}
            </div>
          </div>
          { _isIndex ? (
            <div className="flex flex-col space-y-4">
              <Label
                label="Top K"
              >
                <input
                  type="number"
                  min="1"
                  value={_model?.params?.topK}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, topK: evt.target.value }}}})}
                  className="inputs"
                />
              </Label>
              <Label
                label="Score Threshold"
              >
                <input
                  type="number"
                  min="0"
                  max="1"
                  value={_model?.params?.scoreThreshold}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, scoreThreshold: evt.target.value }}}})}
                  className="inputs"
                />
              </Label>
              <Label
                label="Filter"
              >
                <textarea
                  rows={8}
                  value={_model?.params?.filter ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, filter: evt.target.value}}}})}
                  className="inputs"
                />
              </Label>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <Label
                label="Temperature"
              >
                <input
                  type="number"
                  min="0.0"
                  max="2.0"
                  value={_model?.params?.temperature ?? 1.0}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, temperature: evt.target.value } } } })}
                  className="inputs"
                />
              </Label>
              <Label
                label="Top P"
              >
                <input
                  type="number"
                  min="0.0"
                  max="1.0"
                  value={_model?.params?.top_p ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, top_p: evt.target.value } } } })}
                  className="inputs"
                />
              </Label>
              <Label
                label="Frequency Penalty"
              >
                <input
                  type="number"
                  min="-2.0"
                  max="2.0"
                  value={_model?.params?.frequency_penalty ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, frequency_penalty: evt.target.value } } } })}
                  className="inputs"
                />
              </Label>
              <Label
                label="Presence Penalty"
              >
                <input
                  type="number"
                  min="-2.0"
                  max="2.0"
                  value={_model?.params?.presence_penalty ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, presence_penalty: evt.target.value } } } })}
                  className="inputs"
                />
              </Label>
              <Label
                label="Max Tokens"
              >
                <input
                  type="number"
                  min="1"
                  value={_model?.params?.max_tokens ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, max_tokens: evt.target.value } } } })}
                  className="inputs"
                />
              </Label>
              <Label
                label="Stop Words"
              >
                <input
                  type="text"
                  value={_model?.params?.stop?.join(',') ?? ''}
                  onChange={(evt) => _setChat({ ..._chat, options: { ..._chat.options, model: { ..._chat.options.model, params: { ..._chat.options.model.params, stop: evt.target.value?.split(',') } } } })}
                  className="inputs"
                />
              </Label>
            </div>
          )}
        </div>
      )}
      cancel
      footer={(
        <Button
          type="button"
          onClick={() => {
            setChat(_chat);
            onOpenChange(false);
          }}
        >
          Update
        </Button>
      )}
    />
  );
};

export const ChatModule = ({
  multi,
  type,
  api,
  models,
  options,
  OptionsBar,
  messageOptions,
  promptPlaceholder,
  promptOptions,
  Context,
  onSubmit,
  onSave,
  onFeedback
}: {
  multi?: boolean;
  type?: string;
  api?: string;
  models?: Array<any>;
  options?: (chat: any, setChat: any) => Array<any>;
  OptionsBar?: (chat: any, setChat: any) => React.ReactNode;
  messageOptions?: (chat: any, setChat: any) => Array<any>;
  promptPlaceholder?: string;
  promptOptions?: (chat: any, setChat: any) => Array<any>;
  Context?: (chat: any, setChat: any) => React.ReactNode;
  onSubmit?: (options: any) => void;
  onSave?: (chat: any) => void;
  onFeedback?: ({
    chosenChat,
    rejectedChats
  }: {
    chosenChat: ChatModuleType;
    rejectedChats: Array<ChatModuleType>;
  }) => void;
}) => {

  if (!promptPlaceholder) {
    promptPlaceholder = "Try typing something...";
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  const [inputChangeEvent, setInputChangeEvent] = useState<
    React.ChangeEvent<HTMLTextAreaElement> | undefined
  >();

  const [prompt, setPrompt] = useState<string>('');
  const [chats, setChats] = useState<Array<ChatModuleType>>([{
    options: {}, messages: [], event: "init"
  }]);

  //const getChat = (idx: number) => chats[idx];

  const setChat = (chat: any, idx: number) => {
    const newChats = [...chats];
    newChats[idx] = chat;
    setChats(newChats);
  };

  // TODO: handle -1 (tie), -2 (none)
  const handleFeedback = useCallback((idx: number) => {
    const chosenChat = chats?.[idx];
    const rejectedChats = chats.filter((_, ii: number) => ii !== idx);
    if (onFeedback && chosenChat) {
      setSelectedFeedback(false);
      onFeedback({ chosenChat, rejectedChats });
      return;
    };
    if (idx < 0) {
      setSelectedFeedback(false);
      // TODO: handle tie
    };
    return;
  }, [chats]);

  const handleClick = (_prompt: string|undefined) => {
    setChats(chats.map((_chat) => ({
      ..._chat,
      options: { ..._chat.options, prompt: _prompt },
      event: "submit-pending"
    })));
  };

  //const handleStop = useCallback(() => setChats(chats.map((_chat) => ({ ..._chat, event: "stop-pending" }))), [chats]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get("prompt");
    if (prompt) {
      //setInputChangeEvent({ target: { value: prompt } } as React.ChangeEvent<HTMLTextAreaElement>);
      setPrompt(prompt);
    };
    return;
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const isMobile = clientWidth < 768;
    let left = isMobile
      ? scrollWidth - clientWidth
      : scrollWidth - (clientWidth + clientWidth / 2);
    if (chats.length < 3 && !isMobile) {
      left = 0;
    }
    container.scrollTo({ left, behavior: "smooth" });
    return;
  }, [chats.length]);

  //const closeChat = (idx: number) => setChats(chats.filter((_, ii: number) => ii !== idx));
  const closeChat = (idx: number) => {
    // remove ith idx from array
    const newChats = [...chats];
    newChats.splice(idx, 1);
    setChats(newChats);
  };

  const duplicateChat = (chat: any, idx: number) => {
    const newChats = [...chats];
    //newChats.push({ ...chat, event: "duplicate" });
    newChats.splice(idx + 1, 0, { ...chat, event: "duplicate" });
    setChats(newChats);
  };

  const clearChat = (idx: number) => {
    const newChats = [...chats];
    newChats[idx] = {
      ...newChats[idx],
      messages: [],
      event: "clear-pending" // TODO: use constant
    };
    setChats(newChats);
  };

  const clearAllChats = () => {
    setChats(chats.map((_chat) => ({
      ..._chat,
      options: { ..._chat.options, prompt: '' },
      messages: [],
      event: "clear-pending"
    })));
  };

  if (!type) type = "chat";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const modelLabel = typeLabel === "Search" ? "Search" : "Chat";

  const hasMultipleChats = chats.length > 1;
  const hasMessages = chats.some((chat) => chat.messages.length > 0);
  const [selectedFeedback, setSelectedFeedback] = useState<boolean>(false);
  const [selectedChatIdx, setSelectedChatIdx] = useState<number>(0);
  const [showSystemMessageModal, setShowSystemMessageModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const conditionalOptionsAll = [];
  if (multi && onFeedback && hasMultipleChats && hasMessages) {
    conditionalOptionsAll.push({
      icon: <MedalIcon />,
      label: "Provide Feedback",
      onClick: () => setSelectedFeedback(!selectedFeedback)
    });
  };
  if (multi && hasMultipleChats) {
    conditionalOptionsAll.push({
      icon: <XIcon />,
      label: "Clear All",
      onClick: () => clearAllChats()
    });
  };

  const defaultModels = models ?? [{ label: "Simulator", value: "simulator" }];
  const processedPromptOptions = promptOptions?.(chats?.[selectedChatIdx], (_chat: any) => setChat(_chat, selectedChatIdx)) ?? [];

  return (
    <div className="mt-1 h-full w-full">
      <div className="h-full w-full flex flex-col">
        <div
          ref={scrollRef}
          className="h-full w-full flex flex-row overflow-x-auto overflow-hidden"
        >
          {chats.map((chat: ChatModuleType, idx: number) => {
            const processedOptions = options?.(chat, (_chat: any) => setChat(_chat, idx)) ?? [];
            const preConditionalOptions = [];
            const postConditionalOptions = [];
            if (type === "chat") {
              postConditionalOptions.push({
                icon: <DuplicateIcon />,
                label: `Duplicate ${typeLabel}`,
                onClick: () => duplicateChat(chat, idx)
              });
            };
            if (chats?.length > 1) { 
              postConditionalOptions.push({
                icon: <CloseIcon />,
                label: `Close ${typeLabel}`,
                onClick: () => closeChat(idx)
              });
            };
            if (onSave) {
              postConditionalOptions.push({
                icon: <SaveIcon />,
                label: `Save ${typeLabel}`,
                onClick: () => onSave(chat)
              });
            };
            if (type === "chat") {
              preConditionalOptions.push({
                icon: <SystemIcon />,
                label: "System Message",
                onClick: () => {
                  setSelectedChatIdx(idx);
                  setShowSystemMessageModal(true);
                }
              });
            };
            return(
              <div
                key={`${JSON.stringify(chat)}--${idx}`}
                className={[
                  "flex flex-col",
                  chats.length > 1 ? "md:w-1/2" : "w-full"
                ].join(" ")}
              >
                <div className="flex flex-row space-x-1 items-center justify-center md:p-2">
                  {OptionsBar ? (
                    OptionsBar(chat, (_chat: any) => setChat(_chat, idx))
                  ) : (
                    <div className="flex flex-col w-[300px]">
                      <Select
                        //label={modelLabel}
                        placeholder={`Select ${modelLabel}`}
                        items={defaultModels}
                        value={chat?.options?.model?.value}
                        onChange={(value) => {
                          const model = models?.find((model) => model.id === value);
                          if (!model) return;
                          return setChat({ ...chat, options: { ...chat.options, model } }, idx);
                        }}
                      />
                    </div>
                  )}
                  <div className="has-tooltip">
                    <ButtonMenu
                      variant="none"
                      items={[
                        ...preConditionalOptions,
                        {
                          icon: <SettingsIcon />,
                          label: `Configure ${modelLabel}`,
                          onClick: () => {
                            if (!chat?.options?.model) {
                              toast({
                                variant: "destructive",
                                title: `${modelLabel} Required`,
                                description: `Please select ${modelLabel} to configure`,
                              });
                              return;
                            };
                            setSelectedChatIdx(idx);
                            setShowSettingsModal(true);
                          }
                        },
                        {
                          icon: <XIcon />,
                          label: `Clear ${typeLabel}`,
                          onClick: () => clearChat(idx)
                        },
                        ...postConditionalOptions,
                        ...processedOptions,
                      ]}
                      icon={<ActionsIcon />}
                    />
                    <div className="hidden md:block tooltip -mt-20 -ms-14">{`${typeLabel} Actions`}</div>
                  </div>
                </div>
                <ChatMessages
                  idx={idx}
                  messageOptions={messageOptions}
                  api={api}
                  chat={chat}
                  setChat={(_chat: any) => setChat(_chat, idx)}
                  Context={Context}
                  onSubmit={onSubmit}
                  //onResponse={onResponse}
                  //onFinish={onFinish}
                  //onError={onError}
                />
              </div>
            )}
          )}
        </div>
        {multi && onFeedback && selectedFeedback && hasMultipleChats && hasMessages && (
          <div className="grow-0 mb-1 md:mb-0">
            <FeedbackButtons
              length={chats?.length}
              onFeedback={handleFeedback}
            />
          </div>
        )}
        <div className="grow-0 min-h-12">
          <MultilineInput
            clearOnClick
            id="prompt"
            defaultValue={inputChangeEvent?.target?.value}
            placeholder={promptPlaceholder}
            //value={inputChangeEvent?.target?.value}
            //onChange={handleChange}
            //onSubmit={handleSubmit}
            onClick={handleClick}
            // TODO: https://sdk.vercel.ai/docs/reference/ai-sdk-ui/use-chat#stop
            //onStop={handleStop}
            actions={[
              ...conditionalOptionsAll,
              ...processedPromptOptions
            ]}
          />
        </div>
        <SystemMessageModal
          open={showSystemMessageModal}
          onOpenChange={setShowSystemMessageModal}
          chat={chats?.[selectedChatIdx]}
          setChat={(_chat: any) => setChat(_chat, selectedChatIdx)}
        />
        <ConfigureSettingsModal
          open={showSettingsModal}
          onOpenChange={setShowSettingsModal}
          type={typeLabel}
          chat={chats?.[selectedChatIdx]}
          setChat={(_chat: any) => setChat(_chat, selectedChatIdx)}
          idx={selectedChatIdx}
        />
      </div>
      {multi && (
        <div className="absolute bottom-1/2 right-4 z-40 mx-2">
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={() => setChats([...chats, { options: {}, messages: [], event: "new" }])}
          />
        </div>
      )}
    </div>
  );
};