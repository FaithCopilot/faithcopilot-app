import { useEffect, useState } from "react";

import { EditableChatMessage } from "./EditableChatMessage";
import { Loading } from "@/components/Loading";
import { toast } from "@/components/Toast";

// TODO: move to utils (shared with FeedbackButtons.tsx)
const getColorsByIndex = (idx: number): string => {
  const light = [
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200"
  ];
  const dark = [
    "dark:bg-yellow-600",
    "dark:bg-green-600",
    "dark:bg-blue-600",
    "dark:bg-indigo-600",
    "dark:bg-purple-600",
    "dark:bg-pink-600"
  ];
  return light[idx] + " " + dark[idx];
};

//export const ChatMessages = memo(({
export const ChatMessages = ({
  idx,
  messageOptions,
  api,
  chat,
  setChat,
  Context,
  onSubmit,
  //onResponse,
  //onFinish,
  //onError,
  className
}: {
  idx: number;
  messageOptions?: (message: any, setMessage: any) => Array<any>;
  api?: string;
  chat: any; //ChatModulesType,
  setChat: (chat: any) => void;
  Context?: (chat: any, setChat: any) => React.ReactNode;
  onSubmit?: (options: any) => void;
  //onResponse?: (response: any) => void;
  //onFinish?: (response: any) => void;
  //onError?: (error: any) => void;
  className?: string;
}) => {
  const [_chat, _setChat] = useState<any>(chat);
  const event = _chat?.event;
  const options = _chat?.options ?? {};
  let messages = _chat?.messages ?? [];
  // important: suppressing re-renders so that "onSubmit" can display messages according to whatever use case
  const setMessages = (_messages: any) => messages =  _messages;
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const prompt = _chat?.options?.prompt;

  // respond to "clear" event
  useEffect(() => {
    if (messages?.length < 1 || prompt?.length < 1) {
      setIsLoading(false);
      setError(undefined);
    };
    return;
  }, [prompt, messages?.length]);

  useEffect(() => {
    if (!options?.model) return;
    if (event === "submit-pending") {
      let systemMessage = null;
      let promptMessage = null;
      if (options?.systemMessage?.length > 0) {
        systemMessage = { role: "system", content: options.systemMessage };
      };
      const prompt = options?.prompt;
      if (prompt?.length > 0) {
        promptMessage = { role: "user", content: prompt };
      };
      let filteredMessages = messages?.filter((_message: any) => _message.role !== "system");
      const newMessages = [systemMessage, ...filteredMessages, promptMessage]?.filter(nn => nn);
      _setChat({
        ..._chat,
        messages: newMessages,
        event: "submit-in-progress"
      });
      return;
    };
    if (api && event === "submit-in-progress") {
      // TODO: i.e., /v1/chat/completion
    };
    if (onSubmit && event === "submit-in-progress") {
      (async () => {
        await onSubmit({
          options,
          //messages: [...messages],
          messages, // pass by ref to enable "onSubmit" to modify in real-time
          setMessages,
          setError,
          setIsLoading,
        });
        _setChat({
          ..._chat,
          options: { ...options, prompt: null },
          messages: [...messages],
          event: "submit-complete"
        });
      })();
      return;
    };
    if (event === "submit-complete") {
      setChat(_chat);
      setIsLoading(false);
      return;
    };
    return;
  }, [event, prompt, options, messages]);

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message ?? "Something went wrong. Please try again.",
      });
      setIsLoading(false);
    };
    return;
  }, [error]);

  const secondaryColors = getColorsByIndex(idx);

  return (
    <div
      className={[
        "h-full w-full flex flex-col-reverse overflow-y-auto scrolling-touch scrolling-gpu",
        idx % 2 === 0 ? "bg-primary-400 dark:bg-primary-950" : secondaryColors,
        className ?? ""
      ].join(" ")}
    >
      <div>
        {messages?.map((_message: any, _idx: number) => (
          <EditableChatMessage
            key={`${_message ?? ''}--${_idx}`}
            collapsible
            idx={_idx}
            messages={messages}
            // force a re-render of the messages
            setMessages={(_messages: any) => _setChat({ ..._chat, messages: _messages })}
            messageOptions={messageOptions}
          />
        ))}
        <div className={isLoading ? "py-8 flex flex-row justify-center" : ''}>
          <Loading variant="dots" isLoading={isLoading} className="bg-neutral-900/50 dark:bg-neutral-50/80" />
        </div>
        { Context && (
          <div className="p-4 flex flex-row justify-center">
            { Context(chat, setChat) }
          </div>
        )}
      </div>
    </div>
  );
};
/*
}, (prevProps, nextProps) => {
  console.log("*** ChatMessages: ", prevProps, nextProps);
  return(
    prevProps.idx === nextProps.idx &&
    prevProps.messageOptions === nextProps.messageOptions &&
    prevProps.api === nextProps.api &&
    prevProps.chat === nextProps.chat &&
    prevProps.setChat === nextProps.setChat &&
    //prevProps.Context === nextProps.Context &&
    prevProps.onSubmit === nextProps.onSubmit &&
    prevProps.className === nextProps.className
  );
});
*/
