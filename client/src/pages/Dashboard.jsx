import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    return (
        <div className="dashboard">

            {/* SYSTEM HEADER */}
            <h1 className="dashboard-title">
                ⚔️ LEVEL UP ⚔️
            </h1>

            <p className="dashboard-subtitle">
                HUNTER SYSTEM
            </p>


            {/* WELCOME SECTION */}
            <div className="welcome-section">

                <h2>WELCOME, HUNTER</h2>

                <p>
                    Your journey never ends. Level up and become stronger.
                </p>

            </div>


            {/* HUNTER RANK CARD */}
            <div className="rank-card">

                <p className="rank-label">
                    HUNTER RANK
                </p>

                <h2 className="rank-value">
                    E-RANK
                </h2>

                <p className="level-text">
                    LEVEL 12
                </p>


                {/* EXP INFORMATION */}
                <div className="exp-info">

                    <span>EXP</span>

                    <span>150 / 1000</span>

                </div>


                {/* EXP BAR */}
                <div className="exp-bar">

                    <div className="exp-progress"></div>

                </div>

            </div>


            {/* HUNTER ACTION GRID */}
            <div className="action-grid">


                {/* RESUME */}
                <button
                    className="action-card"
                    onClick={() => navigate("/resume")}
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
                    onClick={() => navigate("/analyze")}
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
                    onClick={() => navigate("/jobs")}
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
                    onClick={() => navigate("/profile")}
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
            <div className="stats-section">

    <h2 className="stats-title">
        HUNTER STATS
    </h2>

    <div className="stats-grid">

        <div className="stat-card">
            <span className="stat-icon">⚡</span>
            <span className="stat-label">LEVEL</span>
            <span className="stat-value">12</span>
        </div>

        <div className="stat-card">
            <span className="stat-icon">🧠</span>
            <span className="stat-label">SKILLS</span>
            <span className="stat-value">8</span>
        </div>

        <div className="stat-card">
            <span className="stat-icon">🎯</span>
            <span className="stat-label">MATCH SCORE</span>
            <span className="stat-value">87%</span>
        </div>

    </div>

    <div className="system-status">
        <span className="status-dot"></span>
        SYSTEM ONLINE
    </div>

</div>

        </div>
    );
}

export default Dashboard;