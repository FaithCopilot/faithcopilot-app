import { useEffect } from "react";

import { ChatModule } from "@/components/ChatModule";

import { toast } from "@/components/Toast";
import { useRequest } from "@/hooks/use-request";

import { ICON_SIZE, ContextIcon } from "@/components/Icons";

const Search = ({ multi, promptPlaceholder, chatOptions, messageOptions, className }={}) => {
  if (!promptPlaceholder) {
    promptPlaceholder="Faith Copilot is here to help! Try typing something..."
  };
  let { data: profiles, error } = useRequest("/v1/search/profiles");
  if (!profiles) profiles = [];
  const mappedOptions = profiles?.map((option) => ({
    ...option, label: option.name, value: option.id
  }));
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);
  return(
    <div className={className ?? "h-full w-full p-1 md:p-2"}>
      <ChatModule
        multi={multi}
        type="search"
        api="/v1/search"
        models={mappedOptions}
        options={chatOptions}
        messageOptions={messageOptions}
        promptPlaceholder={promptPlaceholder}
        onSubmit={async({ options, messages, setMessages, setError, setIsLoading }) => {
          setIsLoading(true);
          if (!options?.prompt || !options?.model?.id) return;
          const prompt = options.prompt;
          const profile = options.model.id;
          const url = new URL(process.env.PUBLIC_API_URL + "/v1/search");
          url.searchParams.append("profile", profile);
          url.searchParams.append("q", prompt);
          const res = await fetch(url, {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json"
            }
          });
          if (!res?.ok) {
            const error = await res.text();
            toast(error, { className: "toast-error" });
            console.error(error);
            setIsLoading(false);
            // TODO: what for? it breaks toast by re-rendering
            //setError({ message: error });
            return;
          };
          const scoreThreshold = options?.model?.params?.scoreThreshold || 0.5;
          const results = await res.json();
          if (results?.length === 0) {
            toast("No results found", { className: "toast-brand" });
            setIsLoading(false);
          };
          let scoreBelowThresholdCount = 0;
          for (let ii = 0; ii < results.length; ii++) {
            const result = results[ii];
            if (result?.score <= scoreThreshold) {
              console.log("Score below threshold: ", result?.score, scoreThreshold);
              scoreBelowThresholdCount++;
              continue;
            };
            const role = "context";
            const content = result?.data;
            const score = result?.score;
            const metadata = result?.metadata;
            setMessages([...messages, { role, icon: <ContextIcon size={ICON_SIZE} />, content, score, metadata }]);
            messages.push({ role, icon: <ContextIcon size={ICON_SIZE} />, content, score, metadata });
          };
          if (scoreBelowThresholdCount === results.length) {
            toast(`
              All result scores are below your threshold (${scoreThreshold})
            `, { className: "toast-brand" });
          };
          setIsLoading(false);
        }}
        /*
        promptOptions={(chat, setChat, idx) => ([
          {
            //icon: <CloseIcon />,
            label: `Close ${idx}`,
            onClick: () => console.log("Close", idx)
          }
        ])}
        */
      />
    </div>
  );
};
export default Search;