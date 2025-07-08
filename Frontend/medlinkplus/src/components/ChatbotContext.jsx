import React, { createContext, useContext, useState } from "react";

const ChatbotContext = createContext();

export function ChatbotProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openChatbot = () => setOpen(true);
  const closeChatbot = () => setOpen(false);

  return (
    <ChatbotContext.Provider value={{ open, setOpen, openChatbot, closeChatbot }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  return useContext(ChatbotContext);
}
