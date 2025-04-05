import { createContext } from 'react'
export type ChatModuleContextType = {
  getChat: (idx: number) => any
  setChat: (chat: any, idx: number) => void
  setPrompt: (prompt: string) => void
}
export const ChatModuleContext = createContext<ChatModuleContextType | null>(null)
