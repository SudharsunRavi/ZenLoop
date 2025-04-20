import { useEffect, useState } from "react";
import {questions} from '../utils/UserQuestions'
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";

const MentalHealthSurvey=()=>{
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [summary, setSummary] = useState("");

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
      setCurrentQuestion(0);
      setAnswers([]);
      setSummary("");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during LLM or backend call:", error);
      toast.error("Failed to analyze or submit survey.", { duration: 3000 });
    }
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