import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

const ChatBot = () => {
  useEffect(() => {
    createChat({
      webhookUrl:
        "https://8ee2c6.n8nvps.site/webhook/211b590b-3663-4e4b-ae9f-f51fd9002c46/chat",
      mode: "window",
      defaultLanguage: "en",
      showWelcomeScreen: false,
      initialMessages: [
        "Xin chào!",
        "Tôi là trợ lý AI của SEN ĐÁ GARDEN. Tôi có thể giúp gì cho bạn?",
      ],
      // Cấu hình i18n
      i18n: {
        en: {
          title: "SEN ĐÁ GARDEN",
          subtitle: "Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7",
          footer: "",
          getStarted: "Bắt đầu cuộc trò chuyện",
          inputPlaceholder: "Nhập câu hỏi của bạn...",
        },
      },
    });
  }, []);
  return null;
};

export default ChatBot;
