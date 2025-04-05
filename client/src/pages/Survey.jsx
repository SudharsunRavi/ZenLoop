import { useState } from "react";

const questions = [
  { id: 1, text: "What brings you here? (Select at least 3)", options: ["Reduce anxiety", "Reduce stress", "Increase happiness", "Improve relationship", "Be more productive", "Overcome depression", "Feel more balanced", "Overcome social anxiety"], multiple: true },
  { id: 2, text: "How much time can you dedicate to your mental health?", options: ["Less than 10 mins", "10-30 mins", "30-60 mins", "More than 1 hour"] },
  { id: 3, text: "Age demographic", options: ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"] },
  { id: 4, text: "Over the last two weeks, how often have you been bothered by feeling nervous, anxious, or on edge?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 5, text: "Over the last two weeks, how often have you been bothered by not being able to stop or control worrying?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 6, text: "Over the last two weeks, how often have you been bothered by having little interest or pleasure in doing things?", options: ["Not at all", "Several days", "More than half the days", "Nearly every day"] },
  { id: 7, text: "Are interpersonal relationships difficult for you?", options: ["Yes", "No", "Sometimes"] },
  { id: 8, text: "Do you often have conflicts or arguments with others?", options: ["Yes", "No", "Sometimes"] },
  { id: 9, text: "Do you usually get enough quality sleep?", options: ["Yes", "No", "Sometimes"] },
  { id: 10, text: "Are you able to maintain a work-life balance?", options: ["Yes", "No", "Sometimes"] },
  { id: 11, text: "Are you content with the state of your physical health?", options: ["Yes", "No", "Somewhat"] },
  { id: 12, text: "How do you usually respond when you feel overwhelmed?", options: ["Withdraw", "Talk to someone", "Exercise", "Sleep", "Other"] },
  { id: 13, text: "How are you feeling now?", options: ["Happy", "Anxious", "Stressed", "Sad", "Motivated", "Calm"] }
];

export default function MentalHealthSurvey() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

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
    
  
    const response = await fetch("http://localhost:5050/survey/", {
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
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
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
