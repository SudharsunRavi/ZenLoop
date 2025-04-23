import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import {LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid} from "recharts";
  
const moodLabels = {1: "😞",2: "😐",3: "😊",4: "😁",5: "🤩"};


const MoodChart = () => {

    const walletAddress = useSelector((state) => state?.user?.currentUser?.walletAddress);
    const [moodData, setMoodData] = useState([]);

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
        fetchMoodTrend();
    }, []);
    return (
        <div className="bg-white p-3 rounded-xl shadow-lg">
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
    )
}

export default MoodChart;