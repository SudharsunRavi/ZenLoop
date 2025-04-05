import { useState } from "react";
import connectWallet from "../utils/ConnectWallet";
import { Link, useNavigate } from "react-router-dom";

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
            alert('Fill all and connect metamask')
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            navigate("/login");
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

        <div className="w-full flex justify-center items-center my-auto">
        <div className="relative w-[400px] h-[500px] bg-transparent border-2 border-black/50 rounded-[20px] backdrop-blur-md flex justify-center items-center">
          <div>
            <form className="flex flex-col items-center" onSubmit={handleSignup}>
              <h2 className="text-3xl text-black text-center mb-8">Signup</h2>
  
              <div className="relative w-[310px] mb-8 border-b-2 border-black">
                <input
                  type="text"
                  id="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full h-[50px] bg-transparent border-none outline-none text-base px-[10px] text-black peer"
                />
                <label className="absolute left-1 top-1/2 -translate-y-1/2 text-black text-base pointer-events-none transition-all duration-500 peer-focus:-top-1 peer-focus:text-md peer-valid:-top-1 peer-valid:text-md">
                  Name
                </label>
              </div>
  
              <div className="relative w-[310px] mb-8 border-b-2 border-black">
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-[50px] bg-transparent border-none outline-none text-base px-[10px] text-black peer"
                />
                <label className="absolute left-1 top-1/2 -translate-y-1/2 text-black text-base pointer-events-none transition-all duration-500 peer-focus:-top-1 peer-focus:text-md peer-valid:-top-1 peer-valid:text-md">
                  Password
                </label>
              </div>

                <button onClick={handleWalletConnect} className="w-[310px] h-10 rounded-full bg-gray-200 border-1 hover:bg-gray-300 cursor-pointer text-base font-semibold mb-6 text-black">
                    {formData?.walletAddress ? `Wallet Connected` : "Connect Wallet"}
                </button>
  
              <button
                type="submit"
                className="w-[310px] h-10 rounded-full bg-gray-700 hover:bg-gray-900 border-none outline-none cursor-pointer text-base font-semibold mb-6 text-white"
              >
                Signup
              </button>
  
              <div className="text-sm text-black text-center">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold hover:underline text-black">
                    Login
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
};

export default Signup;
