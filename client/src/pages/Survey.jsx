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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Toaster />
  
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <div className="text-sm text-gray-500 mb-2 text-right">
          Question {currentQuestion + 1} of {questions.length}
        </div>
  
        <div className="min-h-[320px] flex flex-col justify-start">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {questions[currentQuestion].text}
          </h2>
  
          <div className="space-y-3">
            {questions[currentQuestion].options.map((option) => {
              const selected =
                answers[questions[currentQuestion].id]?.includes(option) ||
                answers[questions[currentQuestion].id] === option;
  
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-4 py-2 rounded-xl border transition duration-200 ease-in-out transform hover:scale-[1.01] 
                    ${
                      selected
                        ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white border-blue-900 shadow-md"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                    }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
  
        <div className="flex justify-between mt-6 items-center">
          {currentQuestion > 0 ? (
            <button
              className="px-4 py-2 bg-white text-blue-600 border border-blue-500 rounded-xl hover:bg-blue-50 transition"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
            >
              Back
            </button>
          ) : (
            <div className="w-[80px]" />
          )}
  
          {currentQuestion < questions.length - 1 ? (
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MentalHealthSurvey;