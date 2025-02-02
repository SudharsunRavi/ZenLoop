const { Web3, HttpProvider } = require("web3");

const web3 = new Web3(new HttpProvider(process.env.INFURA_URL));
const contractABI = require("../utils/contractABI.json");
const contractAddress = process.env.SMART_CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(contractABI, contractAddress);

const addEntry = async (req, res) => {
    const { content, privateKey } = req.body;
    
    try {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);

        const tx = contract.methods.addEntry(content);
        const gas = await tx.estimateGas({ from: account.address });
        const data = tx.encodeABI();
        const nonce = await web3.eth.getTransactionCount(account.address, "pending");

        const signedTx = await web3.eth.accounts.signTransaction(
            {
                to: contractAddress,
                data,
                gas,
                nonce,
                chainId: 11155111, // Sepolia testnet
            },
            privateKey
        );

        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        res.status(200).json({ 
            status: true, 
            transactionHash: receipt.transactionHash 
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            error: error.message 
        });
    }
};

const getMyEntry = async (req, res) => {
    const { index } = req.params;
    const { walletAddress } = req.params;

    try {
        const entry = await contract.methods.getMyEntry(index).call({ 
            from: walletAddress 
        });
        
        res.status(200).json({ 
            status: true, 
            entry: {
                creationDate: Number(entry.creationDate),
                content: entry.content
            }
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            error: error.message 
        });
    }
};

const getAllMyEntries = async (req, res) => {
    const { walletAddress } = req.params;

    try {
        const result = await contract.methods.getAllMyEntries().call({ 
            from: walletAddress 
        });

        // Format the response to combine the arrays into an array of objects
        const entries = result.creationDates.map((date, index) => ({
            creationDate: Number(date),
            content: result.contents[index]
        }));

        res.status(200).json({ 
            status: true, 
            entries 
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            error: error.message 
        });
    }
};

const getMyEntryCount = async (req, res) => {
    const { walletAddress } = req.params;

    try {
        const count = await contract.methods.getMyEntryCount().call({ 
            from: walletAddress 
        });
        
        res.status(200).json({ 
            status: true, 
            count: Number(count) 
        });
    } catch (error) {
        res.status(500).json({ 
            status: false, 
            error: error.message 
        });
    }
};

module.exports = { 
    addEntry, 
    getMyEntry, 
    getAllMyEntries, 
    getMyEntryCount 
};