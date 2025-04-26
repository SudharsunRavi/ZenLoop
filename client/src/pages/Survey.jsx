import { useEffect, useState } from "react";
import {questions} from '../utils/UserQuestions'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import LoadingSpinner from "../components/LoadingSpinner";

const MentalHealthSurvey=()=>{
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

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

  const formatPrompt = (answers) => {
    const intro = `You are a licensed clinical psychologist. Analyse the following answers from a mental health survey and provide a summary. The answers are from a patient who is seeking help for their mental health. The survey consists of various questions about their feelings, thoughts, and behaviors. ANalyse the answers and provide a summary of the individual's mental and emotional state
        Provide:
        1. A concise summary of the individual's mental and emotional state.
        2. Any apparent psychological patterns or disorders based on the answers.
        3. Avoid prefacing your answer with phrases like "I think", "let me", or similar.
        4. Everything should be in third person and maximum 400 words.
        5. No need for recommendations or suggestions, just analyse the patient's answers.
        6. Donot give as a list, just write in paragraph format.
        7. Do not mention the survey or the questions asked.
        8. Do not mention the word "summary" or "analysis".
        9. Do not mention the word "patient" or "individual".
    `;

    const formatted = Object.entries(answers)
      .map(([question, answer], idx) => `${idx + 1}. ${question}: ${Array.isArray(answer) ? answer.join(", ") : answer}`)
      .join("\n");

    return `${intro}${formatted}`;
  };

  const handleSubmit = async () => {
    const formattedAnswers = questions.map((question) => ({
      question: question.text,
      answer: answers[question.id] || "Not answered",
    }));

    const messages = [
      { role: "system", content: "You are a licensed clinical psychologist." },
      { role: "user", content: formatPrompt(answers) }
    ];

    let cleanContent = "";
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_LLM_URL}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-r1-distill-qwen-7b",
          messages: messages,
          temperature: 0.7
        })
      });

      const da = await res.json();

      if (da.choices && da.choices[0] && da.choices[0].message) {
        const raw = da.choices[0].message.content;
        cleanContent = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
        setSummary(cleanContent || "No summary generated.");
      } else {
        console.error("Unexpected response format:", data);
        setSummary("Error generating analysis.");
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/survey/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          responses: formattedAnswers,
          summary: cleanContent,
        }),
      });
  
      const data = await response.json();
  
      if (!data.status) {
        toast.error(data.message, { duration: 3000 });
        return;
      }
  
      toast.success("Survey submitted and analyzed successfully!", { duration: 3000 });
    } catch (error) {
      console.error("Error during LLM or backend call:", error);
      toast.error("Failed to analyze or submit survey.", { duration: 3000 });
    }

    setCurrentQuestion(0);
    setAnswers([]);
    setSummary("");
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className={`relative ${loading ? "pointer-events-none opacity-50" : ""}`}>
      {loading && <LoadingSpinner />}
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
    </div>
  );
}

export default MentalHealthSurvey;