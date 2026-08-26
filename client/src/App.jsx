import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import Analyze from "./pages/Analyze";
import Jobs from "./pages/Jobs";
import MyApplications from "./pages/MyApplications";
import EmployerDashboard from "./pages/EmployerDashboard";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================
                    AUTHENTICATION
                ========================== */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* ==========================
                    MAIN PAGES
                ========================== */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/resume"
                    element={<Resume />}
                />

                <Route
                    path="/analyze"
                    element={<Analyze />}
                />


                {/* ==========================
                    RECRUITMENT
                ========================== */}

                <Route
                    path="/jobs"
                    element={<Jobs />}
                />

                <Route
                    path="/my-applications"
                    element={<MyApplications />}
                />

                {/* ==========================
                    EMPLOYER
                ========================== */}

                <Route
                    path="/employer"
                    element={<EmployerDashboard />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;