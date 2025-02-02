import { useState, useEffect } from "react";
import Web3 from "web3";
import abi from '../../../server/utils/contractABI.json';

const CONTRACT_ADDRESS = "0x83Fb6f6023a965f45EC472539822f57D0Cc6A4f6";
const web3 = new Web3(window.ethereum);
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

const Journal = () => {
    const [walletAddress, setWalletAddress] = useState("");
    const [content, setContent] = useState("");
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);

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
            alert("Please install MetaMask");
        }
    };

    const addJournalEntry = async () => {
        if (!walletAddress || !content) {
            alert("Please provide content for the entry");
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

            alert("Entry added successfully: " + txHash);
            setContent("");
            await fetchEntries();
        } catch (error) {
            alert("Error adding entry: " + error.message);
        }
        setLoading(false);
    };

    const fetchEntries = async () => {
        if (!walletAddress) return;
        
        setLoading(true);
        try {
            const result = await contract.methods.getAllMyEntries().call({ from: walletAddress });

            const formattedEntries = result.creationDates.map((date, index) => ({
                creationDate: new Date(Number(date) * 1000),
                content: result.contents[index]
            }));
            
            formattedEntries.sort((a, b) => b.creationDate - a.creationDate);
            
            setEntries(formattedEntries);
        } catch (error) {
            console.error("Error fetching entries:", error);
            alert("Error fetching entries: " + error.message);
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
        <div className="max-w-6xl mx-auto my-10 px-4">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Journal Entries</h2>
                {!walletAddress ? (
                    <button 
                        onClick={connectWallet}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <p className="text-gray-600">
                        Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </p>
                )}
            </div>

            {walletAddress && (
                <div className="space-y-6">
                    <div className="flex flex-col gap-4">
                        <textarea 
                            placeholder="Write your journal entry here..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="border rounded-lg p-4 h-56 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        
                        <button 
                            onClick={addJournalEntry}
                            disabled={loading || !content}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            {loading ? "Adding..." : "Add Entry"}
                        </button>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-4">Your Entries</h3>
                        {loading ? (
                            <p className="text-gray-600">Loading entries...</p>
                        ) : entries.length === 0 ? (
                            <p className="text-gray-600">No entries yet. Start writing!</p>
                        ) : (
                            <div className="space-y-4">
                                {entries.map((entry, index) => (
                                    <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                                        <p className="text-gray-500 text-sm mb-2">
                                            {formatDate(entry.creationDate)}
                                        </p>
                                        <p className="whitespace-pre-wrap">{entry.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Journal;