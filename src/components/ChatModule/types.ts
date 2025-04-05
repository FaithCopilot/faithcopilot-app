export type ChatMessageType = {
  icon?: any;
  role: string;
  content: string;
};

export type ChatPromptType = {
  system: string;
  user: string;
};

export type ChatModuleType = {
  options: any;
  messages: Array<ChatMessageType>;
  event: string;
};
