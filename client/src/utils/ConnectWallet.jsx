import Web3 from 'web3';

const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            const accounts = await web3.eth.getAccounts();
            return { success: true, account: accounts[0] };
        } catch (error) {
            return { success: false, message: 'User rejected connection' };
        }
    } else {
        return { success: false, message: 'MetaMask is not installed' };
    }
};

export default connectWallet;
