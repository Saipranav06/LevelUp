import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import Analyze from "./pages/Analyze";
import Jobs from "./pages/Jobs";


function App() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route path="/profile" element={<Profile />} />

                <Route path="/dashboard" element={<Dashboard />} />
                 
                <Route path="/resume" element={<Resume />} />

                <Route path="/analyze" element={<Analyze />} />

                <Route path="/jobs" element={<Jobs />} />

            </Routes>

        </BrowserRouter>
    );
}

export default App;