const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
    {
        walletAddress: { 
            type: String, 
            required: true 
        },
        txHash: { 
            type: String, 
            required: true 
        },
        mood: { 
            type: Number, 
            required: true 
        },
        summary: { 
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Journal", journalSchema);
