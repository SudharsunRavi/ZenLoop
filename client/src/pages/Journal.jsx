import { useState, useEffect } from "react";
import Web3 from "web3";
import { Toaster, toast } from "react-hot-toast";
import abi from "../../../server/utils/contractABI.json";

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

  const addJournalEntry = async () => {
    if (!walletAddress || !content) {
      toast.error("Please provide content for the entry", { duration: 3000 });
      return;
    }

    if (!mood) {
      setShowValidation(true);
      return;
    }

    setLoading(true);
    try {
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
        body: JSON.stringify({ walletAddress, txHash, mood })
      });

      setContent("");
      setMood(null);
      setShowValidation(false);
      await fetchEntries();
    } catch (error) {
      toast.error("Error adding entry: " + error.message, { duration: 3000 });
    }
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
        txHash: moodData[index]?.txHash || null
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
  );
};

export default Journal;

