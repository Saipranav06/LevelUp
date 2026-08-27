import { useEffect, useState } from "react";
import api from "../services/api";
import "./Profile.css";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // FETCH PROFILE
    // ==========================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError(
                        "Please login to access your Hunter Profile."
                    );
                    setLoading(false);
                    return;
                }

                const response = await api.get(
                    "/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                console.log("Profile data:", response.data);

                setProfile(response.data);

            } catch (error) {
                console.error(
                    "Profile fetch error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load Hunter Profile"
                );

            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);


    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return (
            <div className="profile-page">

                <div className="profile-top-status">
                    <span>●</span>
                    HUNTER SYSTEM // CONNECTING
                </div>

                <header className="profile-header">
                    <p className="profile-kicker">
                        PLAYER STATUS // PROFILE
                    </p>

                    <h1 className="profile-title">
                        HUNTER PROFILE
                    </h1>

                    <p className="profile-subtitle">
                        HUNTER SYSTEM // PLAYER DATABASE
                    </p>
                </header>

                <div className="profile-loading-card">
                    <div className="loading-core">
                        <span>AI</span>
                    </div>

                    <h2>LOADING HUNTER DATA</h2>

                    <p>
                        Connecting to Hunter Database...
                    </p>

                    <div className="loading-line">
                        <span></span>
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
            <div className="profile-page">

                <header className="profile-header">
                    <p className="profile-kicker">
                        PLAYER STATUS // ERROR
                    </p>

                    <h1 className="profile-title">
                        HUNTER PROFILE
                    </h1>

                    <p className="profile-subtitle">
                        HUNTER SYSTEM // PLAYER DATABASE
                    </p>
                </header>

                <div className="profile-error-card">

                    <div className="error-icon">
                        !
                    </div>

                    <p className="error-label">
                        SYSTEM ERROR
                    </p>

                    <h2>
                        PROFILE DATA UNAVAILABLE
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }


    // ==========================
    // PROFILE DATA
    // ==========================

    const user = profile?.user;
    const hunter = profile?.hunter;

    const username =
        user?.username || "UNKNOWN HUNTER";

    const email =
        user?.email || "No email";

    const role =
        user?.role || "Hunter";

    const bio =
        user?.bio || "No hunter bio available.";

    const score =
        hunter?.score || 0;

    const rank =
        hunter?.rank || "E-RANK";

    const exp =
        hunter?.exp || 0;

    const level =
        hunter?.level || 1;

    const skillsCount =
        hunter?.skillsCount || 0;


    // ==========================
    // EXP CALCULATION
    // ==========================

    const maxExp = 1000;

    const currentLevelExp =
        exp % maxExp;

    const expPercentage =
        Math.min(
            (currentLevelExp / maxExp) * 100,
            100
        );

    const expToNextLevel =
        maxExp - currentLevelExp;


    // ==========================
    // ATTRIBUTE CALCULATIONS
    // ==========================

    const resumePower =
        Math.min(score, 100);

    const skillPower =
        Math.min(skillsCount * 10, 100);

    const huntingPower =
        Math.min(
            Math.round(
                (score + skillsCount * 10) / 2
            ),
            100
        );


    return (
        <div className="profile-page">

            {/* ==========================
                TOP STATUS
            ========================== */}

            <div className="profile-top-status">
                <span>●</span>
                HUNTER SYSTEM // ONLINE
            </div>


            {/* ==========================
                HEADER
            ========================== */}

            <header className="profile-header">

                <p className="profile-kicker">
                    PLAYER STATUS // PROFILE
                </p>

                <h1 className="profile-title">
                    ⚔ HUNTER PROFILE ⚔
                </h1>

                <p className="profile-subtitle">
                    HUNTER SYSTEM // PLAYER DATABASE
                </p>

            </header>


            {/* ==========================
                MAIN PROFILE
            ========================== */}

            <main className="profile-container">


                {/* ==========================
                    IDENTITY SECTION
                ========================== */}

                <section className="identity-card">

                    <div className="identity-scan-line"></div>

                    <div className="identity-left">

                        <div className="profile-avatar-wrapper">

                            <div className="avatar-ring ring-one"></div>
                            <div className="avatar-ring ring-two"></div>

                            <div className="profile-avatar">
                                👤
                            </div>

                            <div className="avatar-status">
                                ●
                            </div>

                        </div>

                    </div>


                    <div className="identity-info">

                        <p className="section-label">
                            HUNTER IDENTITY
                        </p>

                        <h2 className="profile-username">
                            {username}
                        </h2>

                        <p className="profile-email">
                            {email}
                        </p>

                        <div className="profile-role">
                            {role}
                        </div>

                        <p className="profile-bio">
                            {bio}
                        </p>

                    </div>


                    <div className="identity-status">

                        <span className="status-label">
                            SYSTEM STATUS
                        </span>

                        <strong>
                            ONLINE
                        </strong>

                        <span className="status-dot-large">
                            ●
                        </span>

                    </div>

                </section>


                {/* ==========================
                    HUNTER RANK
                ========================== */}

                <section className="hunter-rank-card">

                    <div className="card-corner top-left"></div>
                    <div className="card-corner top-right"></div>
                    <div className="card-corner bottom-left"></div>
                    <div className="card-corner bottom-right"></div>

                    <p className="rank-label">
                        HUNTER RANK
                    </p>

                    <h2 className="hunter-rank">
                        {rank}
                    </h2>

                    <p className="hunter-level">
                        LEVEL {String(level).padStart(2, "0")}
                    </p>


                    {/* EXP INFO */}

                    <div className="hunter-exp-info">

                        <span>
                            EXP
                        </span>

                        <span>
                            {currentLevelExp} / {maxExp}
                        </span>

                    </div>


                    {/* EXP BAR */}

                    <div className="hunter-exp-bar">

                        <div
                            className="hunter-exp-progress"
                            style={{
                                width: `${expPercentage}%`
                            }}
                        >
                            <div className="exp-glow"></div>
                        </div>

                    </div>


                    <p className="exp-next-level">
                        {expToNextLevel} EXP TO NEXT LEVEL
                    </p>

                </section>


                {/* ==========================
                    STATS
                ========================== */}

                <section className="hunter-stats">


                    <div className="hunter-stat-card">

                        <span className="stat-icon">
                            🎯
                        </span>

                        <span className="stat-label">
                            RESUME SCORE
                        </span>

                        <strong className="stat-value">
                            {score}
                        </strong>

                        <span className="stat-line"></span>

                    </div>


                    <div className="hunter-stat-card">

                        <span className="stat-icon">
                            🧠
                        </span>

                        <span className="stat-label">
                            SKILLS
                        </span>

                        <strong className="stat-value">
                            {skillsCount}
                        </strong>

                        <span className="stat-line"></span>

                    </div>


                    <div className="hunter-stat-card">

                        <span className="stat-icon">
                            ⚡
                        </span>

                        <span className="stat-label">
                            LEVEL
                        </span>

                        <strong className="stat-value">
                            {level}
                        </strong>

                        <span className="stat-line"></span>

                    </div>


                    <div className="hunter-stat-card">

                        <span className="stat-icon">
                            ⚔
                        </span>

                        <span className="stat-label">
                            RANK
                        </span>

                        <strong className="stat-value stat-rank">
                            {rank}
                        </strong>

                        <span className="stat-line"></span>

                    </div>

                </section>


                {/* ==========================
                    LOWER INFORMATION
                ========================== */}

                <section className="profile-lower-grid">


                    {/* ATTRIBUTES */}

                    <div className="attributes-card">

                        <div className="card-heading">

                            <div>
                                <p className="section-label">
                                    HUNTER ATTRIBUTES
                                </p>

                                <h2>
                                    COMBAT PROFILE
                                </h2>
                            </div>

                            <span className="heading-icon">
                                ◈
                            </span>

                        </div>


                        <div className="attribute">

                            <div className="attribute-info">
                                <span>
                                    RESUME POWER
                                </span>

                                <strong>
                                    {resumePower}%
                                </strong>
                            </div>

                            <div className="attribute-bar">
                                <span
                                    style={{
                                        width: `${resumePower}%`
                                    }}
                                ></span>
                            </div>

                        </div>


                        <div className="attribute">

                            <div className="attribute-info">
                                <span>
                                    SKILL POWER
                                </span>

                                <strong>
                                    {skillPower}%
                                </strong>
                            </div>

                            <div className="attribute-bar">
                                <span
                                    style={{
                                        width: `${skillPower}%`
                                    }}
                                ></span>
                            </div>

                        </div>


                        <div className="attribute">

                            <div className="attribute-info">
                                <span>
                                    HUNTING POWER
                                </span>

                                <strong>
                                    {huntingPower}%
                                </strong>
                            </div>

                            <div className="attribute-bar">
                                <span
                                    style={{
                                        width: `${huntingPower}%`
                                    }}
                                ></span>
                            </div>

                        </div>

                    </div>


                    {/* SYSTEM STATUS */}

                    <div className="system-card">

                        <div className="card-heading">

                            <div>
                                <p className="section-label">
                                    SYSTEM STATUS
                                </p>

                                <h2>
                                    CORE CONNECTION
                                </h2>
                            </div>

                            <span className="heading-icon">
                                ◉
                            </span>

                        </div>


                        <div className="system-row">
                            <span>
                                ● DATABASE
                            </span>

                            <strong>
                                CONNECTED
                            </strong>
                        </div>


                        <div className="system-row">
                            <span>
                                ● AI CORE
                            </span>

                            <strong>
                                ONLINE
                            </strong>
                        </div>


                        <div className="system-row">
                            <span>
                                ● PROFILE
                            </span>

                            <strong>
                                SYNCED
                            </strong>
                        </div>


                        <div className="system-terminal">
                            <span>›</span>
                            HUNTER SYSTEM ACTIVE
                            <span className="terminal-cursor">
                                _
                            </span>
                        </div>

                    </div>

                </section>


                {/* ==========================
                    FOOTER STATUS
                ========================== */}

                <div className="profile-status">

                    <span className="status-dot">
                        ●
                    </span>

                    HUNTER DATABASE CONNECTED

                    <span className="status-divider">
                        //
                    </span>

                    PROFILE SYNCHRONIZED

                </div>

            </main>

        </div>
    );
}

export default Profile;