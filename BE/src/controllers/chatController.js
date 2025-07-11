const axios = require("axios");

const handleChatRequest = async (req, res) => {
  const { message } = req.body;

  try {
    const ollamaRes = await axios.post("http://localhost:11434/api/chat", {
      model: "gemma3",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      stream: false,
    });

    let reply = "[Không có phản hồi]";
    if (ollamaRes.data?.message?.content) {
      reply = ollamaRes.data.message.content;
    } else if (Array.isArray(ollamaRes.data?.messages)) {
      reply = ollamaRes.data.messages.at(-1)?.content || reply;
    }

    res.json({ reply });
  } catch (err) {
    console.error("Lỗi gọi Ollama:", err.response?.data || err.message);
    res.status(500).json({ error: "Không thể kết nối Ollama" });
  }
};

module.exports = {
  handleChatRequest,
};
