import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MoodChart from "../components/MoodChart";
import SpotifyList from "../components/SpotifyList";
import CopingSuggestion from "../components/CopingSuggestion";

const Dashboard = () => {
  const userid = useSelector((state) => state?.user?.currentUser?._id);
  const navigate = useNavigate();

  const surveryCheck = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/survey/${userid}`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.status === false) {
        toast.error(data.message, { duration: 3000 });
        return;
      }

      if (!data?.data?._id) {
        toast.error("Please fill the survey", { duration: 3000 });
        navigate("/survey");
      }
    } catch (err) {
      toast.error("Failed to check survey", { duration: 3000 });
    }
  };

  useEffect(() => {
    surveryCheck();
  }, []);

  return (
    <div className="p-6 my-5 grid grid-cols-2 gap-4 h-[calc(100vh-5rem)]">
      <Toaster />
  
      <div className="flex flex-col gap-4">
        <div className="flex-1">
          <CopingSuggestion />
        </div>
        <div className="flex-1">
          <MoodChart />
        </div>
      </div>
  
      <div className="h-full">
        <SpotifyList />
      </div>
    </div>
  );
  
   
};

export default Dashboard;
