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

    useEffect(() => {
        connectWallet();
    }, []);

    useEffect(() => {
        if (walletAddress) {
            fetchEntries();
        }
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

        setLoading(true);
        try {
            const tx = contract.methods.addEntry(content);
            const gas = await tx.estimateGas({ from: walletAddress });
            const data = tx.encodeABI();

            const transactionParameters = {
                to: CONTRACT_ADDRESS,
                from: walletAddress,
                data,
                gas: web3.utils.toHex(gas),
            };

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [transactionParameters],
            });

            toast.success("Entry added: " + txHash.slice(0, 10) + "...", { duration: 3000 });

            if (mood) {
                await fetch(`${import.meta.env.VITE_BASE_URL}/journal/entry`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        walletAddress,
                        txHash,
                        mood
                    })
                });
            }

            setContent("");
            setMood(null);
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
        <div className="w-[88vw] my-6">
            <Toaster />
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Journal Entries</h2>
                {!walletAddress ? (
                    <button
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <p className="text-gray-600">Wallet Connected</p>
                )}
            </div>

            {walletAddress && (
                <div className="flex flex-col gap-10">
                    <div className="bg-white p-6 rounded-lg">
                        <textarea
                            placeholder="Write your journal entry here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded-lg p-4 h-56 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex space-x-2">
                                <p className="text-gray-700 mt-1">Select your mood:</p>
                                {["😞", "😐", "😊", "😁", "🤩"].map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMood(index + 1)}
                                        className={`text-2xl ${mood === index + 1 ? 'border-2 border-blue-500 rounded-full' : ''}`}
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={addJournalEntry}
                                disabled={loading || !content}
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {loading ? "Adding..." : "Add Entry"}
                            </button>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Your Entries</h3>
                        {loading ? (
                            <p className="text-gray-600">Loading entries...</p>
                        ) : entries.length === 0 ? (
                            <p className="text-gray-600">No entries yet. Start writing!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border p-2 text-left">Date & Time</th>
                                            <th className="border p-2 text-left">Entry</th>
                                            <th className="border p-2 text-left">Mood</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.map((entry, index) => (
                                            <tr key={index} className="border-b">
                                                <td className="border p-2 text-gray-500">{formatDate(entry.creationDate)}</td>
                                                <td className="border p-2 whitespace-pre-wrap">{entry.content}</td>
                                                <td className="border p-2 text-center text-2xl">
                                                    {entry.mood ? ["😞", "😐", "😊", "😁", "🤩"][entry.mood - 1] : ""}
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
