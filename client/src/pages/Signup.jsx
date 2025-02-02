import { useState } from "react";
import connectWallet from "../utils/ConnectWallet";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username:"",
        password:"",
        walletAddress:""
    });
    const navigate = useNavigate();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        if(!formData.username ||  !formData.password || !formData.walletAddress){
            alert('FIll all and connect metamask')
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            //console.log(data)
            if(!data.status) alert(data.message)
            
        } catch (error) {
            return { status: false, message: "Network error" };
        }
    };

    const handleWalletConnect = async () => {
        const wallet = await connectWallet();
        if (wallet.success) {
            setFormData({
                ...formData,
                walletAddress:wallet?.account
            })
            alert(`${wallet.account}`);
        } else {
            alert(wallet.message);
        }
    };

    return (
        <div className="flex flex-col">
            <h1>Signup</h1>
            <form onSubmit={handleSignup} className="flex flex-col">
                <input type="text" placeholder="Username" id="username" onChange={handleChange} />
                <input type="password" placeholder="Password" id="password" onChange={handleChange} />

                <button onClick={handleWalletConnect}>
                    {formData?.walletAddress ? `Wallet Connected` : "Connect Wallet"}
                </button>
                
                <button>Signup</button>
            </form>
        </div>
    );
};

export default Signup;
