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

                const token =
                    localStorage.getItem("token");


                if (!token) {

                    setError(
                        "Please login to access your Hunter Profile."
                    );

                    setLoading(false);

                    return;
                }


                const response =
                    await api.get(
                        "/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                console.log(
                    "Profile data:",
                    response.data
                );


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

                <h1 className="profile-title">
                    ⚔️ HUNTER PROFILE ⚔️
                </h1>

                <p className="profile-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="profile-card">

                    <h2>
                        🤖 LOADING HUNTER DATA...
                    </h2>

                    <p>
                        Connecting to Hunter Database
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

            <div className="profile-page">

                <h1 className="profile-title">
                    ⚔️ HUNTER PROFILE ⚔️
                </h1>

                <p className="profile-subtitle">
                    HUNTER SYSTEM
                </p>

                <div className="profile-card">

                    <h2>
                        🔴 PROFILE ERROR
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

    const user =
        profile?.user;

    const hunter =
        profile?.hunter;


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


    return (

        <div className="profile-page">


            {/* ==========================
                HEADER
            ========================== */}

            <h1 className="profile-title">
                ⚔️ HUNTER PROFILE ⚔️
            </h1>

            <p className="profile-subtitle">
                HUNTER SYSTEM
            </p>


            {/* ==========================
                USER PROFILE
            ========================== */}

            <div className="profile-card">


                <div className="profile-avatar">
                    👤
                </div>


                <h2 className="profile-username">
                    {username}
                </h2>


                <p className="profile-email">
                    {email}
                </p>


                <p className="profile-role">
                    {role}
                </p>


                <p className="profile-bio">
                    {bio}
                </p>

            </div>


            {/* ==========================
                HUNTER RANK
            ========================== */}

            <div className="hunter-profile-card">

                <p className="hunter-label">
                    HUNTER RANK
                </p>


                <h2 className="hunter-rank">
                    {rank}
                </h2>


                <p className="hunter-level">
                    LEVEL {level}
                </p>


                {/* ==========================
                    EXP
                ========================== */}

                <div className="hunter-exp-info">

                <span>
                        EXP
                </span>

                <span>
                {currentLevelExp} / {maxExp}
                </span>

                </div>

                <p className="exp-next-level">
                {expToNextLevel} EXP TO NEXT LEVEL
                </p>


                <div className="hunter-exp-bar">

                    <div
                        className="hunter-exp-progress"
                        style={{
                            width:
                                `${expPercentage}%`
                        }}
                    ></div>

                </div>

            </div>


            {/* ==========================
                HUNTER STATS
            ========================== */}

            <div className="hunter-stats">


                {/* SCORE */}

                <div className="hunter-stat-card">

                    <span className="hunter-stat-icon">
                        🎯
                    </span>

                    <span className="hunter-stat-label">
                        RESUME SCORE
                    </span>

                    <span className="hunter-stat-value">
                        {score}
                    </span>

                </div>


                {/* SKILLS */}

                <div className="hunter-stat-card">

                    <span className="hunter-stat-icon">
                        🧠
                    </span>

                    <span className="hunter-stat-label">
                        SKILLS
                    </span>

                    <span className="hunter-stat-value">
                        {skillsCount}
                    </span>

                </div>


                {/* LEVEL */}

                <div className="hunter-stat-card">

                    <span className="hunter-stat-icon">
                        ⚡
                    </span>

                    <span className="hunter-stat-label">
                        LEVEL
                    </span>

                    <span className="hunter-stat-value">
                        {level}
                    </span>

                </div>

            </div>


            {/* ==========================
                SYSTEM STATUS
            ========================== */}

            <div className="profile-status">

                <span className="status-dot">
                    ●
                </span>

                HUNTER DATABASE CONNECTED

            </div>


        </div>

    );

}

export default Profile;