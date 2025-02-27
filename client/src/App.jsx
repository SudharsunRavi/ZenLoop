import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Journal from "./pages/Journal";
import UserProfile from "./pages/UserProfile";

// Components
import SidebarComponent from "./components/Sidebar";

import { WHITE_BG } from "./utils/Constants";

const App = () => {
    return (
        <Router>
            <div className="relative min-h-screen bg-cover bg-center bg-no-repeat">
                <img src={WHITE_BG} alt="background" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="relative z-10 min-h-screen flex">
                    {/* Sidebar */}
                    <SidebarComponent />

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/journal" element={<Journal />} />
                            <Route path="/user-profile" element={<UserProfile />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
