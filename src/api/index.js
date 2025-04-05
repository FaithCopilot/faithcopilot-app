const SchemaConstants = Object.freeze({
  SFT: "v1/sft",
  DPO: "v1/dpo",
});

const setSFT = async({ selectedChat }) => {
  const data = {
    schema: SchemaConstants.SFT,
    ts: new Date().toISOString(),
    model: selectedChat?.model?.model ?? null,
    system: selectedChat?.system ?? null,
    prompt: selectedChat?.prompt ?? null,
    messages: selectedChat?.messages ?? [],
  };
  return fetch("/api/datasets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const setDPO = async({ selectedChat, rejectedChats }) => {
  const data = {
    schema: SchemaConstants.DPO,
    ts: new Date().toISOString(),
    model: selectedChat?.model?.model ?? null,
    system: selectedChat?.system ?? null,
    prompt: selectedChat?.prompt ?? null,
    chosen: selectedChat?.messages ?? [],
  };
  return rejectedChats?.map(async(rejectedChat) => {
    if (rejectedChat?.messages?.length < 1) return;
    const _data = { ...data };
    _data["rejected"] = rejectedChat?.messages ?? [];
    _data["model_rejected"] = rejectedChat?.model?.model ?? null;
    return fetch("/api/datasets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(_data),
    });
  });
};

export const setDataset = async({ selectedChat, rejectedChats=null }) => {
  if (!selectedChat?.prompt) {
    const prompt = selectedChat?.messages?.find(item => item?.role === "user")?.content;
    selectedChat["prompt"] = prompt;
  };
  if (rejectedChats) {
    return setDPO({ selectedChat, rejectedChats });
  };
  return setSFT({ selectedChat });
};

export const getModels = async() => {
  try {
    const _models = (await import("../../data/models.json")).default;
    return _models;
  } catch (err) {
    console.error("*** ERROR: ", err);
  };
};
export const getDataset = async({ id, version, type }) => fetch("/api/datasets/?id="+id+"&version="+version+"&type="+type);
export const getDatasets = async({ sft, dpo, meOnly }) => fetch("/api/datasets/?sft="+sft+"&dpo="+dpo+"&meOnly="+meOnly);
