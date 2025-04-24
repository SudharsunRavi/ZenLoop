import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! How are you feeling today?"
    },
  ]);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state?.user?.currentUser?._id);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/history?userId=${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data.messages) {
          const formattedMessages = data.messages.map((msg) => ({
            ...msg,
            timestamp: formatTimestamp(msg.timestamp),
          }));
          setMessages((prevMessages) => [
            ...prevMessages,
            ...formattedMessages,
          ]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [userId]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage, timestamp: formatTimestamp(new Date()) },
    ]);
    setLoading(true);
    const currentMessage = userMessage;
    setUserMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage, userId }),
      });
      const data = await response.json();

      const newMessage = {
        role: "assistant",
        content: data.reply,
        timestamp: formatTimestamp(new Date()),
      };

      setMessages((prevMessages) => [
        ...prevMessages,
        newMessage,
      ]);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Oops! Something went wrong." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-10 p-6 bg-blue-300 rounded-xl shadow-lg">
      <div className="h-[74vh] overflow-y-auto mb-3 p-4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-xl">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md p-3 my-2 text-justify rounded-lg transition-all duration-300 transform ${
                message.role === "user"
                  ? "bg-blue-100 text-black shadow-sm"
                  : "bg-blue-50 text-black shadow-sm"
              }`}
            >
              <div>{message.content}</div>
              <div className="text-xs text-gray-500">{message.timestamp}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs p-3 my-2 rounded-lg bg-blue-50 text-black">
              ...
            </div>
          </div>
        )}
      </div>

      <div className="flex p-3 bg-white bg-opacity-80 rounded-lg border border-blue-300 shadow-lg">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="w-14/15 p-3 rounded-lg border-1 border-blue-300 focus:ring-2 focus:ring-blue-400 transition duration-300"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="w-1/15 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-2xl rounded-lg shadow-md hover:shadow-xl transition duration-300 ml-2"
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chatbot;