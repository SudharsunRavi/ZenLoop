import { useState } from "react";

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi there! How are you feeling today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userMessage },
    ]);
    setLoading(true);
    const currentMessage = userMessage;
    setUserMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      });
      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: data.reply },
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
              {message.content}
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