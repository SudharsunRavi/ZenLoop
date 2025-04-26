const {Web3, HttpProvider} = require("web3");
const JournalEntry = require("../models/journal.module");
const abi = require("../utils/contractABI.json");

const CONTRACT_ADDRESS = process.env.SMART_CONTRACT_ADDRESS;
const web3 = new Web3(new HttpProvider(process.env.INFURA_URL));
const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

// Save mood + tx hash
const saveMetadata = async (req, res) => {
    const { walletAddress, txHash, mood, summary } = req.body;
    if (!walletAddress || !txHash || !mood) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const entry = new JournalEntry({ walletAddress, txHash, mood, summary });
        await entry.save();
        return res.json({ message: "Saved metadata" });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getMetadata = async (req, res) => {
    const { wallet } = req.params;
    if (!wallet) {
        return res.status(400).json({ error: "Wallet address is required" });
    }

    try {
        const metadata = await JournalEntry.find({ walletAddress: wallet }).sort({ createdAt: 1 });
        return res.json(metadata);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUserMoods = async (req, res) => {
    const { wallet } = req.params;
    if (!wallet) {
      return res.status(400).json({ error: "Wallet address is required" });
    }
    try {
      const query = JournalEntry.find({walletAddress: { $regex: new RegExp(`^${wallet}$`, "i") }}).sort({ createdAt: 1 }).select("mood createdAt -_id");
      const moods = await query.exec();
      const moodData = moods.map(entry => ({
        mood: entry.mood,
        timestamp: entry.createdAt,
      }));
  
      return res.json(moodData);
    } catch (err) {
      console.error("Error fetching moods:", err);
      return res.status(500).json({ error: err.message });
    }
  };

module.exports = { saveMetadata, getMetadata, getUserMoods };
