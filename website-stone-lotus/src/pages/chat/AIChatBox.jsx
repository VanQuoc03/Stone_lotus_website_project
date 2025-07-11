import React, { useState, useRef, useEffect } from "react";
import api from "@/utils/axiosInstance";

const LOCAL_STORAGE_KEY = "ai_chat_history";

const AIChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef(null);

  // Tải lịch sử từ localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    }
  }, []);

  // Lưu mỗi khi messages thay đổi
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customMessage) => {
    const content = customMessage || input.trim();

    if (customMessage) setShowSuggestions(false);

    if (!content) return;

    const userMessage = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customMessage) setInput("");
    setLoading(true);

    try {
      const res = await api.post("/api/chat", { message: content });
      const aiMessage = {
        role: "ai",
        content: res.data.reply,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Lỗi khi gửi câu hỏi:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickReplies = [
    "Tôi có thể thanh toán như thế nào?",
    "Phí vận chuyển bao nhiêu?",
    "Sản phẩm có bảo hành không?",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 z-50"
        aria-label="Mở chat AI"
      >
        💬
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm bg-white shadow-xl rounded-lg border p-4 flex flex-col z-50">
      <div className="flex justify-between items-center mb-2">
        <strong>🤖 AI Hỗ trợ</strong>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 text-lg"
        >
          ✖
        </button>
      </div>

      <div className="h-64 overflow-y-auto mb-3 pr-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-2 rounded max-w-[80%] text-sm relative ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-100 text-left text-green-700"
              }`}
            >
              <div className="flex items-start gap-2">
                {/* <span>{msg.role === "user" ? "Người dùng" : "🤖"}</span> */}
                <div>{msg.content}</div>
              </div>
              <div className="text-xs text-gray-400 mt-1 text-right">
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-sm italic mb-2">
            AI đang trả lời...
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {showSuggestions && (
        <div className="flex flex-wrap gap-2 mb-2">
          {quickReplies.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Hỏi AI..."
        />
        <button
          onClick={() => handleSend()}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          disabled={loading}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;
