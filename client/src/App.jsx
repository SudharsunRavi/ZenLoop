import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Journal from "./pages/Journal";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<h1>Working??</h1>} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/journal" element={<Journal />} />
            </Routes>
        </Router>
    );
};

export default App;
