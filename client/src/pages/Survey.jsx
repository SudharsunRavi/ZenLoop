import { useEffect, useState } from "react";
import {questions} from '../utils/UserQuestions'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const MentalHealthSurvey=()=>{
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  const userid=useSelector((state)=>state?.user?.currentUser?._id)

  const surveryCheck=async()=>{
    const res=await fetch(`${import.meta.env.VITE_BASE_URL}/survey/${userid}`, {
      method: "GET",
      credentials: "include",
    })
    const data=await res.json()
    //console.log(data)

    if(data.status==false) {
      toast.error(data.message, { duration: 3000 })
      return
    }

    if(data?.data?._id) {
      toast.success("You have already filled the survey", { duration: 3000 })
      navigate("/dashboard")
    }
  }

  useEffect(()=>{
    surveryCheck()
  },[])

  const handleSelect = (option) => {
    const question = questions[currentQuestion];
    setAnswers((prev) => {
      if (question.multiple) {
        const selected = prev[question.id] || [];
        return { ...prev, [question.id]: selected.includes(option) ? selected.filter(o => o !== option) : [...selected, option] };
      }
      return { ...prev, [question.id]: option };
    });
  };

  const handleSubmit = async () => {
    const formattedAnswers = questions.map((question) => ({
      question: question.text,
      answer: answers[question.id] || "Not answered",
    }));
    
  
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/survey/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        responses: formattedAnswers,
        summary: ["Survey completed"],
      }),
    });
  
    const data = await response.json();
    console.log(data);

    if (!data.status) {
      toast.error(data.message, { duration: 3000 });
      return;
    }

    toast.success("Survey submitted successfully!", { duration: 3000 });
    setCurrentQuestion(0);
    setAnswers([]);
    navigate("/dashboard");
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <Toaster/>
      <div className=" p-6 rounded-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{questions[currentQuestion].text}</h2>
        <div className="space-y-2">
          {questions[currentQuestion].options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className={`w-full p-2 rounded-lg border cursor-pointer ${answers[questions[currentQuestion].id]?.includes(option) || answers[questions[currentQuestion].id] === option ? "bg-blue-400 bg-gradient-to-r to-blue-300 text-white" : "bg-gray-200"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {currentQuestion > 0 && (
            <button className="btn btn-primary" onClick={() => setCurrentQuestion(currentQuestion - 1)}>Back</button>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button className="btn btn-primary" onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentalHealthSurvey;