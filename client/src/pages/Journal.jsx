import { useState, useEffect } from "react";
import Web3 from "web3";
import { Toaster, toast } from "react-hot-toast";
import abi from "../../../server/utils/contractABI.json";
import LoadingSpinner from "../components/LoadingSpinner";

const CONTRACT_ADDRESS = "0x83Fb6f6023a965f45EC472539822f57D0Cc6A4f6";
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const Journal = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState(null);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (walletAddress) fetchEntries();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Wallet connection failed", error);
      }
    } else {
      toast.error("Please install MetaMask", { duration: 3000 });
    }
  };

  const formatPrompt = () => {
    const intro = `You are a licensed clinical psychologist. Analyse the following journal writtern by the patient and provide a summary. The patient who is seeking help for their mental health. Analyse the answers and provide a summary of the individual's mental and emotional state
        Provide:
        1. A concise summary of the individual's mental and emotional state.
        2. Any apparent psychological patterns or disorders based on the answers.
        3. Avoid prefacing your answer with phrases like "I think", "let me", or similar.
        4. Everything should be in third person and maximum 400 words.
        5. No need for recommendations or suggestions, just analyse the patient's answers.
        6. Donot give as a list, just write in paragraph format.
        7. Do not mention the survey or the questions asked.
        8. Do not mention the word "summary" or "analysis".
        9. Do not mention the word "patient" or "individual".
    `;

    const formatted = {content: content, mood: mood};
    const formattedEntries = Object.entries(formatted).map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(", ")}`;
      }
      return `${key}: ${value}`;
    }
    ).join("\n");

    return `${intro}${formattedEntries}`;
  };

  const addJournalEntry = async () => {
    if (!walletAddress || !content) {
      toast.error("Please provide content for the entry", { duration: 3000 });
      return;
    }

    if (!mood) {
      setShowValidation(true);
      return;
    }

    const messages = [
      { role: "system", content: "You are a licensed clinical psychologist." },
      { role: "user", content: formatPrompt() }
    ];

    let cleanContent = "";
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_LLM_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-qwen-7b",
          messages: messages,
          temperature: 0.7
        })
      });

      const da = await res.json();

      if (da.choices && da.choices[0] && da.choices[0].message) {
        const raw = da.choices[0].message.content;
        cleanContent = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
      } else {
        console.error("Unexpected response format:", data);
      }

      const tx = contract.methods.addEntry(content);
      const gas = await tx.estimateGas({ from: walletAddress });
      const data = tx.encodeABI();

      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          to: CONTRACT_ADDRESS,
          from: walletAddress,
          data,
          gas: web3.utils.toHex(gas)
        }]
      });

      toast.success("Entry added: " + txHash.slice(0, 10) + "...", { duration: 3000 });

      await fetch(`${import.meta.env.VITE_BASE_URL}/journal/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress, txHash, mood, summary: cleanContent })
      });
      await fetchEntries();
    } catch (error) {
      toast.error("Error adding entry: " + error.message, { duration: 3000 });
    }

    setContent("");
    setMood(null);
    setShowValidation(false);
    setLoading(false);
  };

  const fetchEntries = async () => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      const blockchainRes = await contract.methods.getAllMyEntries().call({ from: walletAddress });
      const moodRes = await fetch(`${import.meta.env.VITE_BASE_URL}/journal/entries/${walletAddress}`);
      const moodData = await moodRes.json();

      const formattedEntries = blockchainRes.creationDates.map((date, index) => ({
        creationDate: new Date(Number(date) * 1000),
        content: blockchainRes.contents[index],
        mood: moodData[index]?.mood || null,
        txHash: moodData[index]?.txHash || null,
        summary: moodData[index]?.summary || null
      }));

      formattedEntries.sort((a, b) => b.creationDate - a.creationDate);
      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Error fetching entries: " + error.message, { duration: 3000 });
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`relative ${loading ? "pointer-events-none opacity-50" : ""}`}>
      {loading && <LoadingSpinner />}
      <div className="w-[88vw] max-w-7xl mx-auto my-5">
        <Toaster />
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Journal Entries</h2>
          {!walletAddress ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 text-white px-5 py-2 rounded-xl shadow hover:bg-blue-700 transition-colors"
            >
              Connect Wallet
            </button>
          ) : (
            <span className="text-sm text-green-600 font-medium">Wallet Connected</span>
          )}
        </div>

        {walletAddress && (
          <div className="flex flex-col gap-10">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <textarea
                placeholder="Write your journal here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-300 rounded-xl p-4 h-56 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 text-gray-800 resize-none transition"
              />
              <div className="mt-4 flex justify-between items-center flex-wrap gap-4">
                <div className="flex items-center space-x-3">
                  <p className="text-gray-700 font-medium">Your Mood:</p>
                  {["😞", "😐", "😊", "😁", "🤩"].map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setMood(index + 1);
                        setShowValidation(false);
                      }}
                      className={`text-2xl transition transform hover:scale-140 ${
                        mood === index + 1 ? "border-2 border-blue-500 rounded-full p-1" : ""
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                {!mood && showValidation && (
                  <p className="text-sm text-red-500 mt-1">Please select your mood.</p>
                )}

                <button
                  onClick={addJournalEntry}
                  disabled={loading || !content}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add Entry"}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Entries</h3>
              {loading ? (
                <p className="text-gray-600">Loading entries...</p>
              ) : entries.length === 0 ? (
                <p className="text-gray-600">No entries yet. Start writing!</p>
              ) : (
                <div className="h-[250px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent rounded-xl border border-gray-200">
                  <table className="min-w-full border-separate border-spacing-y-2">
                    <thead>
                      <tr className="bg-gray-200 text-gray-700 sticky top-0 z-0">
                        <th className="p-3 text-left">Date & Time</th>
                        <th className="p-3 text-left">Entry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry, index) => (
                        <tr key={index} className="bg-gray-50 hover:bg-gray-100 transition rounded-xl">
                          <td className="p-3 text-gray-500 align-top w-[160px]">
                            {formatDate(entry.creationDate)}
                          </td>
                          <td className="p-3 text-gray-800 whitespace-pre-wrap">
                            {entry.content}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;

