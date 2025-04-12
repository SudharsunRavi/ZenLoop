import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { login } from "../utils/redux/userSlice";

const Login = () => {
    const currentUser = useSelector((state) => state?.user?.currentUser);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        username:"",
        password:""
    });

    const [error, setError] = useState(null);

    useEffect(() => {
      if(currentUser?._id) {
        toast.error("You are already logged in", { duration: 3000 });
        navigate("/dashboard");
        return;
      }
    },[])

    const handleChange=(e)=>{
        setFormData({
            ...formData,
            [e.target.id]:e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast("Please fill all fields", { duration: 3000 });
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });
    
            const data = await response.json();

            if(data.status==false) {
              toast.error(data.message, { duration: 3000 });
              return;
            }
            
            toast.success("Login successful!", { duration: 3000 });
            dispatch(login(data.data))
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.message, { duration: 3000 });
            return error;
        }
    };

    return (
        <div className="w-full flex justify-center items-center my-auto">
          <Toaster/>
          <div className="relative w-[400px] h-[450px] bg-transparent border-2 border-black/50 rounded-[20px] backdrop-blur-md flex justify-center items-center">
            <div>
              <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <h2 className="text-3xl text-black text-center mb-6">Login</h2>
    
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
    
                <div className="relative w-[310px] mb-8 border-b-2 border-black">
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-[50px] bg-transparent border-none outline-none text-base px-[10px] text-black peer"
                    />
                    <label className="absolute left-1 top-1/2 -translate-y-1/2 text-black text-base pointer-events-none transition-all duration-500 peer-focus:-top-1 peer-focus:text-md peer-valid:-top-1 peer-valid:text-md">
                      Name
                    </label>
                  </div>
                </div>
    
                <div className="relative w-[310px] mb-8 border-b-2 border-black">
                  <div className="relative">
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
                </div>
    
                <button
                  type="submit"
                  className="w-[310px] h-10 rounded-full bg-gray-700 hover:bg-gray-900 border-none outline-none cursor-pointer text-base font-semibold mb-6 text-white"
                >
                  Login
                </button>
    
                <div className="text-sm text-black text-center">
                  <p>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-semibold hover:underline text-black">
                      Signup
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
};

export default Login;
