import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Missions.css";

const API_URL = "https://levelup-server-ppvx.onrender.com";

function Missions() {
    const navigate = useNavigate();

    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [completing, setCompleting] = useState(null);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    // ==========================
    // FETCH MISSIONS
    // ==========================

    const fetchMissions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/missions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));

                    console.log("MISSIONS API STATUS:", response.status);
                    console.log("MISSIONS API ERROR:", errorData);

                    throw new Error(
                        errorData.message ||
                         `Failed to load missions (${response.status})`
             );
            }

            const data = await response.json();

            setMissions(
                data.missions ||
                data ||
                []
            );

        } catch (err) {
            console.error("Mission fetch error:", err);

            setError(
                "Unable to load missions. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

    // ==========================
    // COMPLETE MISSION
    // ==========================

    const completeMission = async (missionId) => {

        try {

            setCompleting(missionId);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/missions/${missionId}/complete`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Unable to complete mission"
                );
            }

            setMessage(
                data.message ||
                "MISSION COMPLETED! EXP EARNED ⚔️"
            );

            // Refresh mission states
            await fetchMissions();

        } catch (err) {

            console.error(
                "Complete mission error:",
                err
            );

            setMessage(
                err.message ||
                "Something went wrong."
            );

        } finally {

            setCompleting(null);

        }
    };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return (
            <div className="missions-page">

                <div className="missions-loading">

                    <div className="mission-spinner"></div>

                    <p>
                        INITIALIZING HUNTER MISSIONS...
                    </p>

                </div>

            </div>
        );
    }

    // ==========================
    // PAGE
    // ==========================

    return (
        <div className="missions-page">

            {/* ==========================
                TOP NAVIGATION
            ========================== */}

            <div className="missions-topbar">

                <button
                    className="mission-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ← BACK TO DASHBOARD
                </button>

                <div className="mission-system-status">
                    <span className="status-dot"></span>
                    HUNTER SYSTEM ONLINE
                </div>

            </div>


            {/* ==========================
                HEADER
            ========================== */}

            <header className="missions-header">

                <div className="missions-eyebrow">
                    <span></span>
                    LEVEL UP // DAILY PROTOCOL
                    <span></span>
                </div>

                <h1>
                    HUNTER MISSIONS
                </h1>

                <p>
                    Complete daily challenges.
                    Earn EXP. Strengthen your profile.
                </p>

            </header>


            {/* ==========================
                MESSAGE
            ========================== */}

            {message && (

                <div className="mission-message">

                    <span className="message-icon">
                        ◆
                    </span>

                    {message}

                </div>

            )}


            {/* ==========================
                ERROR
            ========================== */}

            {error && (

                <div className="mission-error">

                    <strong>
                        SYSTEM ERROR
                    </strong>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchMissions}
                    >
                        RETRY
                    </button>

                </div>

            )}


            {/* ==========================
                MISSION STATS
            ========================== */}

            <section className="mission-stats">

                <div className="mission-stat-card">

                    <div className="stat-icon">
                        ⚔
                    </div>

                    <div>
                        <span>
                            AVAILABLE
                        </span>

                        <strong>
                            {
                                missions.filter(
                                    mission =>
                                        !mission.completed
                                ).length
                            }
                        </strong>
                    </div>

                </div>


                <div className="mission-stat-card">

                    <div className="stat-icon">
                        ✓
                    </div>

                    <div>
                        <span>
                            COMPLETED
                        </span>

                        <strong>
                            {
                                missions.filter(
                                    mission =>
                                        mission.completed
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                <div className="mission-stat-card">

                    <div className="stat-icon xp">
                        XP
                    </div>

                    <div>

                        <span>
                            TOTAL REWARD
                        </span>

                        <strong>

                            {
                                missions.reduce(
                                    (total, mission) =>
                                        total +
                                        (
                                            mission.completed
                                                ? Number(
                                                    mission.rewardExp || 0
                                                )
                                                : 0
                                        ),
                                    0
                                )
                            }

                        </strong>

                    </div>

                </div>

            </section>


            {/* ==========================
                MISSION SECTION
            ========================== */}

            <section className="missions-section">

                <div className="section-heading">

                    <div>

                        <span>
                            DAILY PROTOCOL
                        </span>

                        <h2>
                            TODAY'S MISSIONS
                        </h2>

                    </div>

                    <div className="mission-count">
                        {missions.length} MISSIONS
                    </div>

                </div>


                {/* ==========================
                    EMPTY
                ========================== */}

                {missions.length === 0 ? (

                    <div className="missions-empty">

                        <div className="empty-symbol">
                            ⚔
                        </div>

                        <h2>
                            NO MISSIONS AVAILABLE
                        </h2>

                        <p>
                            The Hunter System has no
                            active missions right now.
                        </p>

                    </div>

                ) : (

                    <div className="missions-grid">

                        {missions.map(
                            (mission, index) => {

                                const completed =
                                    Boolean(
                                        mission.completed
                                    );

                                return (

                                    <article
                                        className={`mission-card ${
                                            completed
                                                ? "completed"
                                                : ""
                                        }`}
                                        key={
                                            mission.id
                                        }
                                    >

                                        {/* CARD NUMBER */}

                                        <div className="mission-number">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


                                        {/* TOP */}

                                        <div className="mission-card-top">

                                            <div
                                                className={`mission-symbol ${
                                                    completed
                                                        ? "done"
                                                        : ""
                                                }`}
                                            >
                                                {completed
                                                    ? "✓"
                                                    : "⚔"}
                                            </div>

                                            <div className="mission-type">

                                                <span>
                                                    {mission.type ||
                                                        "DAILY"}
                                                </span>

                                                {completed && (
                                                    <small>
                                                        COMPLETED
                                                    </small>
                                                )}

                                            </div>

                                        </div>


                                        {/* TITLE */}

                                        <h3>
                                            {
                                                mission.title
                                            }
                                        </h3>


                                        {/* DESCRIPTION */}

                                        <p className="mission-description">
                                            {
                                                mission.description
                                            }
                                        </p>


                                        {/* DIVIDER */}

                                        <div className="mission-divider"></div>


                                        {/* BOTTOM */}

                                        <div className="mission-card-bottom">

                                            <div className="mission-reward">

                                                <span>
                                                    REWARD
                                                </span>

                                                <strong>
                                                    +{
                                                        mission.rewardExp ||
                                                        0
                                                    } XP
                                                </strong>

                                            </div>


                                            <button
                                                className={`mission-complete-btn ${
                                                    completed
                                                        ? "completed-btn"
                                                        : ""
                                                }`}
                                                disabled={
                                                    completed ||
                                                    completing ===
                                                        mission.id
                                                }
                                                onClick={() =>
                                                    completeMission(
                                                        mission.id
                                                    )
                                                }
                                            >

                                                {completing ===
                                                mission.id ? (
                                                    <>
                                                        <span className="button-spinner"></span>
                                                        PROCESSING
                                                    </>
                                                ) : completed ? (
                                                    <>
                                                        ✓ COMPLETED
                                                    </>
                                                ) : (
                                                    <>
                                                        COMPLETE
                                                        <span>
                                                            →
                                                        </span>
                                                    </>
                                                )}

                                            </button>

                                        </div>

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}

            </section>


            {/* ==========================
                FOOTER
            ========================== */}

            <footer className="missions-footer">

                <span>
                    ● HUNTER AI CORE // SYSTEM OPERATIONAL
                </span>

                <span>
                    DAILY MISSIONS RESET AUTOMATICALLY
                </span>

            </footer>

        </div>
    );
}

export default Missions;