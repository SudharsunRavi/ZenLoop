import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Journal from "./pages/Journal";
import UserProfile from "./pages/UserProfile";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";

// Components
const SidebarComponent = lazy(() => import("./components/Sidebar"));

import { WHITE_BG } from "./utils/Constants";
import MentalHealthSurvey from "./pages/Survey";

const App = () => {
    return (
        <Router>
            <div className="relative min-h-screen bg-cover bg-center bg-no-repeat">
                <img src={WHITE_BG} alt="background" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="relative z-10 min-h-screen flex">

                    <Suspense fallback={<div className="w-20 h-screen bg-gray-100 dark:bg-neutral-800" />}>
                        <SidebarComponent />
                    </Suspense>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <Routes>
                            <Route path="/" element={<MentalHealthSurvey />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/journal" element={<Journal />} />
                            <Route path="/user-profile" element={<UserProfile />} />
                            <Route path="/chatbot" element={<Chatbot />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
