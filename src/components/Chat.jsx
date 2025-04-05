import { useEffect, useState } from "react";

import { ChatModule } from "@/components/ChatModule";

import { Button } from "@/components/buttons/Button";
import { Modal } from "@/components/Modal";

import Search from "./Search";

import { toast } from "@/components/Toast";

import { useRequest } from "@/hooks/use-request";

// TODO: refactor to Icons
import {
  CircleFadingPlusIcon as ContextIcon,
  TextCursorInputIcon,
  FileIcon,
  SearchIcon,
  SlidersHorizontalIcon as ProfilesIcon
} from "lucide-react";

import {
  ICON_SIZE,
  ActionsIcon
} from "@/components/Icons";

const SelectTextInput = ({ onSelect }) => {
  const [value, setValue] = useState('');
  return(
    <Modal
      size="lg"
      title="Text Input"
      content={(
        <textarea
          value={value}
          onChange={(evt) => setValue(evt.target.value)}
          className="inputs w-full h-[calc(100vh-125px)] md:h-[calc(100vh-200px)]"
        />
      )}
      cancel
      footer={(
        <Button
          variant="surface"
          label="OK"
          onClick={() => onSelect({ type: "text", value })}
        />
      )}
      trigger={(
        <Button
          variant="surface"
          icon={<TextCursorInputIcon />}
          //label="Text Input"
        >
          <div className="flex flex-row space-x-2">
            <span>Text Input</span>
            <span className="text-neutral-500 text-xs pt-2">Copy-and-paste text content</span>
          </div>
        </Button>
      )}
    />
  );
};

const SelectSearch = ({ onSelect }) => {
  return(
    <Modal
      title="Search"
      content={(
        <Search
          promptPlaceholder="Search"
          chatOptions={(chat, setChat, idx) => ([
            {
              icon: <ContextIcon />,
              label: "Add All to Chat",
              onClick: () => onSelect({ type: "search", value: chat?.messages })
            }
          ])}
          messageOptions={(message, setMessage) => ([
            {
              icon: <ContextIcon />,
              label: "Add to Chat",
              onClick: () => onSelect({ type: "search", value: message })
            }
          ])}
          className="w-full h-[calc(100vh-125px)] md:h-[calc(100vh-200px)] p-1 md:p-2"
        />
      )}
      trigger={(
        <Button
          variant="surface"
          icon={<SearchIcon />}
          type="button"
        >
          <div className="flex flex-row space-x-2">
            <span>Search</span>
            <span className="text-neutral-500 text-xs pt-2">Search and include results as context</span>
          </div>
        </Button>
      )}
    />
  );
};

const ContextComponent = (chat, setChat) => {
  const [open, setOpen] = useState(false);
  return(
    <div>
      <div className="has-tooltip">
        <Button variant="primary" icon={<ContextIcon/>} onClick={() => setOpen(true)} />
        <div className="hidden md:block tooltip -mt-20 -ms-10">Context Actions</div>
      </div>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Context"
        content={(
          <div className="flex flex-col space-y-4 w-full justify-center p-4">
            <SelectSearch
              onSelect={(selectedValue) => {
                if (Array.isArray(selectedValue?.value)) {
                  const filteredMessages = selectedValue.value.filter((msg) => msg.role !== "user");
                  setChat({ ...chat, messages: [...chat.messages, ...filteredMessages] });
                  setOpen(false);
                  return;
                };
                setChat({ ...chat, messages: [...chat.messages, selectedValue.value] });
                setOpen(false);
              }}
            />
            {/*<SelectContext onSelect={(selectedValue) => console.log("*** ON SELECT CONTEXT INPUT", selectedValue)} />*/}
            <SelectTextInput
              onSelect={(selectedValue) => {
                if (!selectedValue?.value) {
                  setOpen(false);
                  return;
                };
                setChat({ ...chat, messages: [...chat.messages, { role: "context", icon: <ContextIcon />, content: selectedValue.value }] })
                setOpen(false);
              }}
            />
            <Button
              disabled
              variant="surface"
              icon={<FileIcon />}
            >
              <div className="flex flex-row space-x-2">
                <span>Upload File</span>
                <span className="text-neutral-500 text-xs pt-2">PDFs, Docs, Spreadsheets, and more</span>
              </div>
            </Button>
          </div>
        )}
      />
    </div>
  );
};

const OptionsBar = ({ chat, setChat, mappedOptions }) => {
  return(
    <Modal
      title="Options"
      content={(
        <div className="flex flex-col space-y-4 w-full justify-center p-4">
          <h1>Settings</h1>
        </div>
      )}
      trigger={<Button icon={<ActionsIcon size={ICON_SIZE} />} />}
    />
  );
};

const Chat = ({ multi } = {}) => {
  let { data: profiles, error: profilesError } = useRequest("/v1/chat/profiles?public=true");
  if (!profiles) profiles = [];
  let { data: models, error: modelsError } = useRequest("/v1/models?public=true");
  if (!models) models = [];
  //const error = profilesError || modelsError;
  const mergedOptions = [...profiles, ...models];
  const mappedOptions = mergedOptions?.map((option) => ({
    ...option, label: option.name, value: option.id
  }));
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return (
    <div className="h-full w-full p-1 md:p-2">
      <ChatModule
        multi={multi}
        //type="chat"
        api="/v1/chat"
        models={mappedOptions} // TODO: rename to options
        promptPlaceholder="Faith Copilot is here to help! Try typing something..."
        /*
        OptionsBar={(chat, setChat) => (
          <OptionsBar chat={chat} setChat={setChat} options={mappedOptions} />
        )}
        options={(chat, setChat) => {
          if (!chat?.options?.model) return [];
          return [
            {
              icon: <ProfilesIcon />,
              label: "Save As Profile",
              onClick: () => console.log("Save As Profile: ", chat.options.model)
            }
          ]
        }}
        messageOptions={(message, setMessage) => ([
          {
            icon: <PlusIcon />,
            label: "ZZ Message",
            onClick: () => console.log("Message options for message #: ", idx)
          }
        ])}
        */
        Context={ContextComponent}
        onSubmit={async({ options, messages, setMessages, setError, setIsLoading }) => {
          const parsedMessages = messages.map((message) => {
            if (
              message?.role !== "system" ||
              message?.role !== "user" ||
              message?.role !== "assistant"
            ) {
              return ({ ...message, role: "user" });
            };
            return message;
          });
          const model = options?.model?.id;
          const params = options?.model?.params;
          const parsedTemperature = typeof params?.temperature === "string" ? parseFloat(params?.temperature) : params?.temperature;
          const parsedMaxTokens = typeof params?.max_tokens === "string" ? parseInt(params?.max_tokens) : params?.max_tokens;
          const parsedParams = {};
          if (parsedTemperature) parsedParams["temperature"] = parsedTemperature;
          if (parsedMaxTokens) parsedParams["max_tokens"] = parsedMaxTokens;
          setIsLoading(true);
          const res = await fetch(process.env.PUBLIC_API_URL + "/v1/chat/completions", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model,
              ...parsedParams,
              messages: parsedMessages,
              stream: false
            })
          });
          if (!res?.ok) {
            console.error(await res.text());
            setIsLoading(false);
            setError({ message: "Something went wrong. Please try again later, or try a different model" });
            return;
          };
          const data = await res.json();
          let completionMessage = data?.choices?.[0]?.message;
          const content = completionMessage?.content;
          setMessages([ ...messages, { role: "assistant", content }]);
          setIsLoading(false);
        }}
        onSave={(chat) => console.log("*** ON SAVE: ", chat)}
        onFeedback={({ chosenChat, rejectedChats }) => {
          console.log("*** ON FEEDBACK: ", { chosenChat, rejectedChats });
          return;
        }}
      />
    </div>
  );
};
export default Chat;