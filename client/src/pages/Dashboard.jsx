import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const [hunter, setHunter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ==========================
    // GET HUNTER DATA
    // ==========================

    useEffect(() => {

        const fetchHunterData = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                const response =
                    await api.get(
                        "/hunter",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                console.log(
                    "Hunter data:",
                    response.data
                );

                setHunter(response.data);

            } catch (error) {

                console.error(
                    "Hunter data error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load hunter data"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchHunterData();

    }, []);


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="dashboard">

                <h1 className="dashboard-title">
                    ⚔️ LEVEL UP ⚔️
                </h1>

                <p className="dashboard-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="welcome-section">

                    <h2>
                        LOADING HUNTER DATA...
                    </h2>

                    <p>
                        Connecting to Hunter Database...
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // ERROR
    // ==========================

    if (error) {

        return (

            <div className="dashboard">

                <h1 className="dashboard-title">
                    ⚔️ LEVEL UP ⚔️
                </h1>

                <p className="dashboard-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="welcome-section">

                    <h2>
                        🔴 HUNTER DATABASE ERROR
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // SAFE DEFAULTS
    // ==========================

    const score =
        hunter?.score ?? 0;

    const rank =
        hunter?.rank ?? "E-RANK";

    const level =
        hunter?.level ?? 1;

    const exp =
        hunter?.exp ?? 0;

    const skillsCount =
        hunter?.skillsCount ?? 0;


    // ==========================
    // CURRENT LEVEL EXP
    // ==========================

    const currentLevelExp =
        exp % 1000;


    const expPercentage =
        currentLevelExp / 10;


    const expToNextLevel =
        1000 - currentLevelExp;


    // ==========================
    // DASHBOARD
    // ==========================

    return (

        <div className="dashboard">


            {/* ==========================
                SYSTEM HEADER
            ========================== */}

            <h1 className="dashboard-title">
                ⚔️ LEVEL UP ⚔️
            </h1>

            <p className="dashboard-subtitle">
                HUNTER SYSTEM
            </p>


            {/* ==========================
                WELCOME
            ========================== */}

            <div className="welcome-section">

                <h2>
                    WELCOME, HUNTER
                </h2>

                <p>
                    Your journey never ends.
                    Level up and become stronger.
                </p>

            </div>


            {/* ==========================
                HUNTER RANK
            ========================== */}

            <div className="rank-card">

                <p className="rank-label">
                    HUNTER RANK
                </p>

                <h2 className="rank-value">
                    {rank}
                </h2>

                <p className="level-text">
                    LEVEL {level}
                </p>


                {/* ==========================
                    EXP INFORMATION
                ========================== */}

                <div className="exp-info">

                    <span>
                        EXP
                    </span>

                    <span>
                        {currentLevelExp} / 1000
                    </span>

                </div>


                {/* ==========================
                    EXP BAR
                ========================== */}

                <div className="exp-bar">

                    <div
                        className="exp-progress"
                        style={{
                            width:
                                `${expPercentage}%`
                        }}
                    ></div>

                </div>


                <p className="next-level-text">

                    {expToNextLevel} EXP
                    TO NEXT LEVEL

                </p>

            </div>


            {/* ==========================
                HUNTER ACTION GRID
            ========================== */}

            <div className="action-grid">


                {/* RESUME */}

                <button
                    className="action-card"
                    onClick={() =>
                        navigate("/resume")
                    }
                >

                    <span className="action-icon">
                        📄
                    </span>

                    <span className="action-title">
                        RESUME ANALYZER
                    </span>

                    <span className="action-description">
                        Upload and review your resume
                    </span>

                </button>


                {/* AI ANALYSIS */}

                <button
                    className="action-card"
                    onClick={() =>
                        navigate("/analyze")
                    }
                >

                    <span className="action-icon">
                        🤖
                    </span>

                    <span className="action-title">
                        AI ANALYSIS
                    </span>

                    <span className="action-description">
                        Analyze your skills and strengths
                    </span>

                </button>


                {/* JOBS */}

                <button
                    className="action-card"
                    onClick={() =>
                        navigate("/jobs")
                    }
                >

                    <span className="action-icon">
                        💼
                    </span>

                    <span className="action-title">
                        JOB HUNT
                    </span>

                    <span className="action-description">
                        Discover matching opportunities
                    </span>

                </button>


                {/* PROFILE */}

                <button
                    className="action-card"
                    onClick={() =>
                        navigate("/profile")
                    }
                >

                    <span className="action-icon">
                        👤
                    </span>

                    <span className="action-title">
                        HUNTER PROFILE
                    </span>

                    <span className="action-description">
                        View your hunter information
                    </span>

                </button>


            </div>


            {/* ==========================
                HUNTER STATS
            ========================== */}

            <div className="stats-section">

                <h2 className="stats-title">
                    HUNTER STATS
                </h2>


                <div className="stats-grid">


                    <div className="stat-card">

                        <span className="stat-icon">
                            ⚡
                        </span>

                        <span className="stat-label">
                            LEVEL
                        </span>

                        <span className="stat-value">
                            {level}
                        </span>

                    </div>


                    <div className="stat-card">

                        <span className="stat-icon">
                            🧠
                        </span>

                        <span className="stat-label">
                            SKILLS
                        </span>

                        <span className="stat-value">
                            {skillsCount}
                        </span>

                    </div>


                    <div className="stat-card">

                        <span className="stat-icon">
                            🎯
                        </span>

                        <span className="stat-label">
                            MATCH SCORE
                        </span>

                        <span className="stat-value">
                            {score}%
                        </span>

                    </div>


                </div>


                {/* ==========================
                    DATABASE STATUS
                ========================== */}

                <div className="system-status">

                    <span className="status-dot"></span>

                    HUNTER DATABASE CONNECTED

                </div>

            </div>


        </div>

    );

}

export default Dashboard;