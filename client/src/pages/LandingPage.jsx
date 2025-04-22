import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const { currentUser } = useSelector((state) => state?.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?._id) {
      toast.success("You are already logged in", { duration: 3000 });
      navigate("/dashboard");
      return;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-white to-blue-300">
      <Toaster />

      <header className="mx-16 my-4">
        <img
          src="SmallLogo.png"
          alt="Logo"
          className="h-20"
        />
      </header>

      <main className="flex flex-1 flex-col-reverse lg:flex-row items-center justify-between px-8 lg:px-20 -mt-40">
        <div className="w-full lg:w-2/3 text-center lg:text-left space-y-4 mt-8 lg:mt-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Prioritize Your <span className="text-blue-600">Mental Well-being</span>
          </h1>
          <p className="text-xl text-gray-700 mt-10">
            <span className="font-bold">Welcome to Zenloop - Your private, AI-powered mental wellness companion.</span>            
          </p>
          <p className="text-xl text-gray-600 text-justify -mt-3">
            Reflect through secure journaling, track your emotions, and engage with a chatbot trained in Cognitive Behavioral Therapy.
            Experience personalized support and real-time insights designed to help you grow and heal.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 transition"
          >
            Get Started
          </button>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src="HeroImage.gif"
            alt="Mental Health Landing"
            className="max-w-3/4 h-auto"
          />
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
