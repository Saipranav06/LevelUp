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

            <div className="dashboard loading-screen">

                <div className="system-logo">
                    <span className="logo-line"></span>
                    <span>LEVEL UP</span>
                    <span className="logo-line"></span>
                </div>

                <p className="dashboard-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="loading-panel">

                    <div className="loading-orb"></div>

                    <h2>
                        INITIALIZING SYSTEM
                    </h2>

                    <p>
                        Connecting to Hunter Database...
                    </p>

                    <div className="loading-bar">
                        <div className="loading-progress"></div>
                    </div>

                </div>

            </div>

        );

    }


    // ==========================
    // ERROR
    // ==========================

    if (error) {

        return (

            <div className="dashboard error-screen">

                <div className="system-logo">
                    <span className="logo-line"></span>
                    <span>LEVEL UP</span>
                    <span className="logo-line"></span>
                </div>

                <p className="dashboard-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="error-panel">

                    <div className="error-symbol">
                        !
                    </div>

                    <h2>
                        SYSTEM ERROR
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        RECONNECT
                    </button>

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
                BACKGROUND EFFECTS
            ========================== */}

            <div className="ambient ambient-one"></div>
            <div className="ambient ambient-two"></div>
            <div className="grid-overlay"></div>


            {/* ==========================
                SYSTEM HEADER
            ========================== */}

            <header className="system-header">

                <div className="system-status-top">

                    <span className="online-dot"></span>

                    SYSTEM ONLINE

                </div>

                <div className="system-logo">

                    <span className="logo-line"></span>

                    <span className="logo-text">
                        LEVEL UP
                    </span>

                    <span className="logo-line"></span>

                </div>

                <p className="dashboard-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="header-divider">
                    <span></span>
                    <span>HUNTER INTERFACE</span>
                    <span></span>
                </div>

            </header>


            {/* ==========================
                WELCOME
            ========================== */}

            <div className="welcome-section">

                <div className="welcome-tag">
                    <span></span>
                    SYSTEM MESSAGE
                </div>

                <h2>
                    WELCOME, HUNTER
                </h2>

                <p>
                    Your journey never ends.
                    <br />
                    Level up and become stronger.
                </p>

            </div>


            {/* ==========================
                HUNTER RANK
            ========================== */}

            <section className="rank-card">

                <div className="rank-corner top-left"></div>
                <div className="rank-corner top-right"></div>
                <div className="rank-corner bottom-left"></div>
                <div className="rank-corner bottom-right"></div>

                <div className="rank-header">

                    <div>

                        <p className="rank-label">
                            CURRENT HUNTER RANK
                        </p>

                        <h2 className="rank-value">
                            {rank}
                        </h2>

                        <p className="level-text">
                            LEVEL {level}
                        </p>

                    </div>

                    <div className="rank-badge">
                        <span>{rank.charAt(0)}</span>
                    </div>

                </div>


                <div className="exp-section">

                    <div className="exp-info">

                        <span>
                            EXPERIENCE
                        </span>

                        <span>
                            {currentLevelExp} / 1000
                        </span>

                    </div>

                    <div className="exp-bar">

                        <div
                            className="exp-progress"
                            style={{
                                width:
                                    `${expPercentage}%`
                            }}
                        ></div>

                        <div className="exp-scan"></div>

                    </div>

                    <div className="exp-footer">

                        <span>
                            PROGRESSION
                        </span>

                        <span>
                            {expPercentage.toFixed(0)}%
                        </span>

                    </div>

                </div>


                <div className="next-level">

                    <span className="next-level-pulse"></span>

                    {expToNextLevel} EXP
                    REQUIRED FOR NEXT LEVEL

                </div>

            </section>


            {/* ==========================
                ACTION GRID
            ========================== */}

            <section className="action-grid">


                {/* RESUME */}

                <button
                    className="action-card resume-card"
                    onClick={() =>
                        navigate("/resume")
                    }
                >

                    <div className="card-glow"></div>

                    <div className="action-visual">

                        <div className="resume-symbol">

                            <div className="document-body">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>

                            <div className="scan-line"></div>

                        </div>

                    </div>

                    <div className="action-content">

                        <span className="action-code">
                            MODULE 01
                        </span>

                        <span className="action-title">
                            RESUME ANALYZER
                        </span>

                        <span className="action-description">
                            Analyze your resume and uncover
                            your strongest opportunities.
                        </span>

                    </div>

                    <span className="card-arrow">
                        →
                    </span>

                </button>


{/* ==========================
    AI ANALYSIS
========================== */}

<button
    className="action-card ai-card"
    onClick={() => navigate("/analyze")}
>

    <div className="card-glow"></div>

    <div className="action-visual ai-visual">

        <div className="ai-core">

            <div className="ai-orbit orbit-outer"></div>

            <div className="ai-orbit orbit-middle"></div>

            <div className="ai-orbit orbit-inner"></div>

            <div className="ai-orbit-dot dot-one"></div>

            <div className="ai-orbit-dot dot-two"></div>

            <div className="ai-core-center">
                <span>AI</span>
            </div>

        </div>

    </div>

    <div className="action-content">

        <span className="action-code">
            MODULE 02
        </span>

        <span className="action-title">
            AI ANALYSIS
        </span>

        <span className="action-description">
            Discover your skills, strengths
            and hidden potential.
        </span>

    </div>

    <span className="card-arrow">
        →
    </span>

</button>

                {/* JOBS */}

                <button
                    className="action-card jobs-card"
                    onClick={() =>
                        navigate("/jobs")
                    }
                >

                    <div className="card-glow"></div>

                    <div className="action-visual">

                        <div className="quest-symbol">

                            <div className="quest-circle">
                                <span></span>
                            </div>

                            <div className="quest-cross horizontal"></div>
                            <div className="quest-cross vertical"></div>

                        </div>

                    </div>

                    <div className="action-content">

                        <span className="action-code">
                            MODULE 03
                        </span>

                        <span className="action-title">
                            JOB HUNT
                        </span>

                        <span className="action-description">
                            Discover opportunities matched
                            to your hunter profile.
                        </span>

                    </div>

                    <span className="card-arrow">
                        →
                    </span>

                </button>


                {/* PROFILE */}

                <button
                    className="action-card profile-card"
                    onClick={() =>
                        navigate("/profile")
                    }
                >

                    <div className="card-glow"></div>

                    <div className="action-visual">

                        <div className="profile-symbol">

                            <div className="profile-head"></div>

                            <div className="profile-body"></div>

                        </div>

                    </div>

                    <div className="action-content">

                        <span className="action-code">
                            MODULE 04
                        </span>

                        <span className="action-title">
                            HUNTER PROFILE
                        </span>

                        <span className="action-description">
                            View your hunter identity,
                            skills and progression.
                        </span>

                    </div>

                    <span className="card-arrow">
                        →
                    </span>

                </button>


            </section>


            {/* ==========================
                HUNTER STATS
            ========================== */}

            <section className="stats-section">

                <div className="stats-header">

                    <div>
                        <span className="stats-kicker">
                            SYSTEM METRICS
                        </span>

                        <h2 className="stats-title">
                            HUNTER STATS
                        </h2>
                    </div>

                    <span className="stats-live">
                        LIVE
                    </span>

                </div>


                <div className="stats-grid">


                    {/* LEVEL */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <span className="stat-label">
                                LEVEL
                            </span>

                            <span className="stat-index">
                                01
                            </span>

                        </div>

                        <div className="stat-number">
                            {level}
                        </div>

                        <div className="stat-line">
                            <span
                                style={{
                                    width:
                                        `${Math.min(
                                            level * 10,
                                            100
                                        )}%`
                                }}
                            ></span>
                        </div>

                    </div>


                    {/* SKILLS */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <span className="stat-label">
                                SKILLS
                            </span>

                            <span className="stat-index">
                                02
                            </span>

                        </div>

                        <div className="stat-number">
                            {skillsCount}
                        </div>

                        <div className="stat-line">
                            <span
                                style={{
                                    width:
                                        `${Math.min(
                                            skillsCount * 10,
                                            100
                                        )}%`
                                }}
                            ></span>
                        </div>

                    </div>


                    {/* MATCH SCORE */}

                    <div className="stat-card">

                        <div className="stat-top">

                            <span className="stat-label">
                                MATCH SCORE
                            </span>

                            <span className="stat-index">
                                03
                            </span>

                        </div>

                        <div className="stat-number">
                            {score}%
                        </div>

                        <div className="stat-line">
                            <span
                                style={{
                                    width:
                                        `${Math.min(
                                            score,
                                            100
                                        )}%`
                                }}
                            ></span>
                        </div>

                    </div>


                </div>


                {/* ==========================
                    DATABASE STATUS
                ========================== */}

                <div className="system-status">

                    <span className="status-dot"></span>

                    <span>
                        HUNTER DATABASE CONNECTED
                    </span>

                    <span className="status-time">
                        SECURE
                    </span>

                </div>

            </section>


            <div className="dashboard-footer">

                <span>
                    LEVEL UP SYSTEM
                </span>

                <span>
                    •
                </span>

                <span>
                    HUNTER INTERFACE v1.0
                </span>

            </div>

        </div>

    );

}

export default Dashboard;