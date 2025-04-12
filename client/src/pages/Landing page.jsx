import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage=()=>{
    const {currentUser} = useSelector((state) => state?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser?._id) {
            toast.success("You are already logged in", { duration: 3000 });
            navigate("/dashboard");
            return;
        }
    },[])

    return(
        <div>
            <Toaster/>
            <p>Center-login,signup btn</p>
        </div>
    );
}

export default LandingPage;