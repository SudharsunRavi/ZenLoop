import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username:"",
        password:""
    });
    const navigate = useNavigate();

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5050/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
    
            const data = await response.json();
            if(!data.status) alert(data.message)
        } catch (error) {
            return { status: false, message: "Network error" };
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Username" id="username" onChange={handleChange} />
                <input type="password" placeholder="Password" id="password" onChange={handleChange} />
                <button>Login</button>
            </form>
        </div>
    );
};

export default Login;
