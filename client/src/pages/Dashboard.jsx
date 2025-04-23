import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const moodLabels = {1: "😞",2: "😐",3: "😊",4: "😁",5: "🤩"};

const Dashboard = () => {
  const userid = useSelector((state) => state?.user?.currentUser?._id);
  const walletAddress = useSelector((state) => state?.user?.currentUser?.walletAddress);
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState([]);

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

  const fetchMoodTrend = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/journal/moods/${walletAddress}`, {
        method: "GET",
        credentials: "include",
      });

      const moods = await res.json();

      const formattedMood = moods.map((entry, index) => ({
        date: new Date(entry.timestamp).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        }),
        mood: entry.mood,
        moodLabel: moodLabels[entry.mood],
      }));

      setMoodData(formattedMood);
    } catch (err) {
      toast.error("Failed to load mood data");
    }
  };

  useEffect(() => {
    surveryCheck();
    fetchMoodTrend();
  }, []);

  return (
    <div className="p-6 my-5 grid grid-cols-2 gap-4">
      <Toaster />
  
      {/* First Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl flex justify-center font-medium mb-4">Mood Trend</h2>
  
        {moodData.length === 0 ? (
          <p className="text-gray-500">No mood data available.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={moodData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} padding={{ left: 10, right: 10 }} />
              <YAxis domain={[1, 5]} tickFormatter={(tick) => moodLabels[tick]} />
              <Tooltip formatter={(value) => moodLabels[value]} labelStyle={{ fontWeight: "bold" }} />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
  
      {/* Second Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl flex justify-center font-medium mb-4">Graph 2</h2>
        {/* Placeholder for second graph */}
        <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
      </div>
  
      {/* Third Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl flex justify-center font-medium mb-4">Graph 3</h2>
        {/* Placeholder for third graph */}
        <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
      </div>
  
      {/* Fourth Graph */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl flex justify-center font-medium mb-4">Graph 4</h2>
        {/* Placeholder for fourth graph */}
        <div className="w-full h-60 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );  
};

export default Dashboard;
