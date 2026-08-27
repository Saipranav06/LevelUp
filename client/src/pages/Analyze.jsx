import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Analyze.css";


/* =========================================================
   HUNTER RANK
========================================================= */

function getHunterRank(score) {

    const value = Number(score) || 0;

    if (value >= 90) return "S-RANK";
    if (value >= 80) return "A-RANK";
    if (value >= 70) return "B-RANK";
    if (value >= 60) return "C-RANK";
    if (value >= 50) return "D-RANK";

    return "E-RANK";
}


/* =========================================================
   ARRAY HELPER
========================================================= */

function getArray(value) {

    if (Array.isArray(value)) {
        return value;
    }

    if (
        value !== undefined &&
        value !== null &&
        value !== ""
    ) {
        return [value];
    }

    return [];
}


/* =========================================================
   ANALYSIS CARD
========================================================= */

function AnalysisCard({
    number,
    icon,
    title,
    description,
    items,
    accent = "blue"
}) {

    const [expanded, setExpanded] = useState(true);

    const list = getArray(items);

    return (
        <article
            className={`analysis-card ${accent} ${
                expanded ? "expanded" : "collapsed"
            }`}
        >

            <button
                className="analysis-card-button"
                onClick={() => setExpanded(!expanded)}
                type="button"
            >

                <div className="analysis-card-number">
                    {number}
                </div>

                <div className="analysis-card-icon">
                    {icon}
                </div>

                <div className="analysis-card-heading">

                    <span>
                        HUNTER MODULE
                    </span>

                    <h3>
                        {title}
                    </h3>

                </div>

                <div className="analysis-card-toggle">
                    {expanded ? "−" : "+"}
                </div>

            </button>


            {expanded && (

                <div className="analysis-card-body">

                    {description && (
                        <p className="analysis-description">
                            {description}
                        </p>
                    )}

                    <div className="analysis-items">

                        {list.length > 0 ? (

                            list.map((item, index) => (

                                <div
                                    className="analysis-item"
                                    key={index}
                                >

                                    <span className="analysis-item-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <span className="analysis-item-dot"></span>

                                    <p>
                                        {String(item)}
                                    </p>

                                </div>

                            ))

                        ) : (

                            <div className="analysis-item empty-item">

                                <span className="analysis-item-dot"></span>

                                <p>
                                    No data returned by the AI engine.
                                </p>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </article>
    );
}


/* =========================================================
   ANALYZE PAGE
========================================================= */

function Analyze() {

    const navigate = useNavigate();

    const [analyzing, setAnalyzing] =
        useState(false);

    const [analysis, setAnalysis] =
        useState(null);

    const [hunter, setHunter] =
        useState(null);

    const [error, setError] =
        useState("");

    const [levelUp, setLevelUp] =
        useState(null);


    /* =====================================================
       LOAD SAVED ANALYSIS
    ===================================================== */

    useEffect(() => {

        try {

            const savedAnalysis =
                localStorage.getItem("resumeAnalysis");

            const savedHunter =
                localStorage.getItem("hunterData");

            if (savedAnalysis) {

                const parsed =
                    JSON.parse(savedAnalysis);

                if (
                    parsed &&
                    typeof parsed === "object"
                ) {

                    setAnalysis(parsed);

                }

            }

            if (savedHunter) {

                const parsedHunter =
                    JSON.parse(savedHunter);

                if (
                    parsedHunter &&
                    typeof parsedHunter === "object"
                ) {

                    setHunter(parsedHunter);

                }

            }

        } catch (err) {

            console.error(
                "Could not load saved analysis:",
                err
            );

        }

    }, []);


    /* =====================================================
       LOCAL STORAGE
    ===================================================== */

    const resumeText =
        localStorage.getItem("resumeText");

    const resumeFileName =
        localStorage.getItem("resumeFileName");


    /* =====================================================
       ANALYZE RESUME
    ===================================================== */

    const handleAnalyze = async () => {

        try {

            setAnalyzing(true);

            setError("");

            setLevelUp(null);

            const currentResumeText =
                localStorage.getItem("resumeText");

            if (
                !currentResumeText ||
                currentResumeText.trim() === ""
            ) {

                setError(
                    "NO RESUME DETECTED. PLEASE UPLOAD YOUR RESUME FIRST."
                );

                setAnalyzing(false);

                return;
            }


            /* =================================================
               TOKEN
            ================================================= */

            const token =
                localStorage.getItem("token");

            if (!token) {

                setError(
                    "LOGIN SESSION EXPIRED. PLEASE LOGIN AGAIN."
                );

                setAnalyzing(false);

                return;
            }


            console.log(
                "=========================================="
            );

            console.log(
                "STARTING HUNTER AI RESUME ANALYSIS"
            );

            console.log(
                "=========================================="
            );


            /* =================================================
               API REQUEST
            ================================================= */

            const response =
                await api.post(

                    "/analyze-resume",

                    {
                        resumeText:
                            currentResumeText
                    },

                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }

                );


            console.log(
                "========== ANALYSIS RESPONSE =========="
            );

            console.log(
                response.data
            );

            console.log(
                "======================================="
            );


            /* =================================================
               BACKEND RESPONSE

               {
                   message,
                   analysis: {
                       score,
                       skills,
                       strengths,
                       weaknesses,
                       recommendations
                   },
                   hunter: {
                       score,
                       rank,
                       exp,
                       earnedExp,
                       level
                   }
               }
            ================================================= */

            const result =
                response.data?.analysis ||
                null;

            const hunterData =
                response.data?.hunter ||
                null;


            if (
                !result ||
                typeof result !== "object"
            ) {

                setError(
                    "AI returned an empty or invalid analysis."
                );

                setAnalyzing(false);

                return;
            }


            /* =================================================
               SAVE RESULT
            ================================================= */

            setAnalysis(result);

            setHunter(hunterData);


            localStorage.setItem(
                "resumeAnalysis",
                JSON.stringify(result)
            );


            if (hunterData) {

                localStorage.setItem(
                    "hunterData",
                    JSON.stringify(hunterData)
                );

            }


            /* =================================================
               LEVEL UP
            ================================================= */

            if (
                hunterData &&
                hunterData.didLevelUp
            ) {

                setLevelUp({

                    message:
                        hunterData.levelUpMessage,

                    level:
                        hunterData.level,

                    previousLevel:
                        hunterData.previousLevel,

                    earnedExp:
                        hunterData.earnedExp

                });

            }


            console.log(
                "========== ANALYSIS COMPLETE =========="
            );


        } catch (err) {

            console.error(
                "Hunter analysis error:",
                err
            );


            if (
                err.response?.status === 401 ||
                err.response?.status === 403
            ) {

                setError(
                    err.response?.data?.message ||
                    "LOGIN SESSION EXPIRED. PLEASE LOGIN AGAIN."
                );

            } else {

                setError(
                    err.response?.data?.message ||
                    "AI ANALYSIS FAILED. PLEASE TRY AGAIN."
                );

            }

        } finally {

            setAnalyzing(false);

        }

    };


    /* =====================================================
       DATA
    ===================================================== */

    const score =
        Number(analysis?.score) || 0;

    const rank =
        hunter?.rank ||
        getHunterRank(score);

    const skills =
        getArray(
            analysis?.skills
        );

    const strengths =
        getArray(
            analysis?.strengths
        );

    const weaknesses =
        getArray(
            analysis?.weaknesses
        );

    const recommendations =
        getArray(
            analysis?.recommendations
        );

    const hunterLevel =
        Number(hunter?.level) || 1;

    const hunterExp =
        Number(hunter?.exp) || 0;

    const earnedExp =
        Number(hunter?.earnedExp) || 0;

    const skillsCount =
        hunter?.skillsCount ??
        skills.length;


    /* =====================================================
       SCORE RING
    ===================================================== */

    const scoreDegrees =
        Math.min(score, 100) * 3.6;


    /* =====================================================
       EXP
    ===================================================== */

    const expPerLevel = 1000;

    const currentExp =
        hunterExp % expPerLevel;

    const expPercentage =
        Math.min(
            (currentExp / expPerLevel) * 100,
            100
        );


    /* =====================================================
       INITIAL PAGE
    ===================================================== */

    if (!analysis) {

        return (

            <div className="analyze-page">

                <div className="analysis-background-grid"></div>

                <div className="analysis-particles">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>


                {/* =================================================
                   TOP BAR
                ================================================= */}

                <div className="analysis-topbar">

                    <button
                        className="back-button"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        type="button"
                    >

                        <span>
                            ←
                        </span>

                        BACK TO DASHBOARD

                    </button>


                    <div className="core-status">

                        <span className="core-status-dot"></span>

                        <span>
                            AI CORE STATUS
                        </span>

                        <strong>
                            {analyzing
                                ? "SCANNING"
                                : "ONLINE"}
                        </strong>

                    </div>

                </div>


                {/* =================================================
                   HEADER
                ================================================= */}

                <header className="analysis-header">

                    <div className="level-badge">

                        <span></span>

                        LEVEL UP // AI CORE

                    </div>


                    <h1 className="analyze-title">

                        HUNTER AI

                        <span>
                            ANALYSIS
                        </span>

                    </h1>


                    <p className="analyze-subtitle">

                        ARTIFICIAL INTELLIGENCE RESUME EVALUATION SYSTEM

                    </p>

                </header>


                {/* =================================================
                   AI CORE
                ================================================= */}

                <section className="ai-core-section">

                    <div
                        className={`ai-core ${
                            analyzing
                                ? "scanning"
                                : ""
                        }`}
                    >

                        <div className="core-ring ring-one"></div>

                        <div className="core-ring ring-two"></div>

                        <div className="core-ring ring-three"></div>

                        <div className="core-orbit orbit-one"></div>

                        <div className="core-orbit orbit-two"></div>


                        <div className="core-center">

                            <div className="core-pulse"></div>

                            <span>

                                {analyzing
                                    ? "SCAN"
                                    : "AI"}

                            </span>

                        </div>


                        {analyzing && (

                            <div className="core-scan-line"></div>

                        )}

                    </div>


                    <div className="core-ready">

                        <span></span>

                        {analyzing
                            ? "AI CORE // ANALYZING PROFILE"
                            : "AI CORE // READY"}

                    </div>


                    {/* =================================================
                       LOADED RESUME
                    ================================================= */}

                    {resumeFileName && (

                        <div className="loaded-resume">

                            <span className="resume-indicator"></span>

                            <div>

                                <small>
                                    PROFILE LOADED
                                </small>

                                <strong>
                                    {resumeFileName}
                                </strong>

                            </div>

                        </div>

                    )}


                    {!resumeFileName && resumeText && (

                        <div className="loaded-resume">

                            <span className="resume-indicator"></span>

                            <div>

                                <small>
                                    PROFILE LOADED
                                </small>

                                <strong>
                                    RESUME PROFILE
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                       ANALYZE BUTTON
                    ================================================= */}

                    <button
                        className={`initiate-button ${
                            analyzing
                                ? "scanning"
                                : ""
                        }`}
                        onClick={handleAnalyze}
                        disabled={analyzing}
                        type="button"
                    >

                        <span className="button-energy"></span>

                        <span>

                            {analyzing
                                ? "ANALYZING PROFILE..."
                                : "INITIATE ANALYSIS"}

                        </span>


                        {!analyzing && (

                            <span className="button-arrow">
                                →
                            </span>

                        )}

                    </button>


                    <p className="button-hint">

                        {analyzing
                            ? "AI CORE IS EVALUATING YOUR HUNTER PROFILE"
                            : "CLICK TO START AI-POWERED HUNTER ANALYSIS"}

                    </p>

                </section>


                {/* =================================================
                   ERROR
                ================================================= */}

                {error && (

                    <div className="analysis-error">

                        <span className="error-icon">
                            !
                        </span>

                        <div>

                            <strong>
                                CORE ERROR
                            </strong>

                            <p>
                                {error}
                            </p>

                        </div>

                    </div>

                )}

            </div>

        );

    }


    /* =====================================================
       RESULT PAGE
    ===================================================== */

    return (

        <div className="analyze-page results-page">

            <div className="analysis-background-grid"></div>


            {/* =================================================
               TOP BAR
            ================================================= */}

            <div className="analysis-topbar">

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    type="button"
                >

                    <span>
                        ←
                    </span>

                    BACK TO DASHBOARD

                </button>


                <div className="core-status">

                    <span className="core-status-dot"></span>

                    <span>
                        AI CORE STATUS
                    </span>

                    <strong>
                        ANALYSIS COMPLETE
                    </strong>

                </div>

            </div>


            {/* =================================================
               REPORT HEADER
            ================================================= */}

            <section className="hunter-report">

                <div className="report-left">

                    <span className="report-status-dot"></span>

                    <div>

                        <span className="report-label">
                            HUNTER INTELLIGENCE REPORT
                        </span>

                        <h1>
                            PROFILE ANALYSIS COMPLETE
                        </h1>

                        <p>
                            {resumeFileName ||
                                "RESUME PROFILE"}
                        </p>

                    </div>

                </div>


                <div className="report-status">

                    <span></span>

                    ANALYSIS COMPLETE

                </div>

            </section>


            {/* =================================================
               SCORE
            ================================================= */}

            <section className="score-card">

                <div
                    className="score-ring"
                    style={{
                        "--score-degrees":
                            `${scoreDegrees}deg`
                    }}
                >

                    <div className="score-ring-inner">

                        <span className="score-number">
                            {score}
                        </span>

                        <span className="score-max">
                            / 100
                        </span>

                    </div>

                </div>


                <div className="score-details">

                    <span className="score-label">
                        HUNTER SCORE
                    </span>

                    <div className="big-score">

                        {score}

                        <span>
                            /100
                        </span>

                    </div>


                    <div className="rank-row">

                        <span>
                            HUNTER RANK
                        </span>

                        <strong className={`rank-badge rank-${rank.charAt(0)}`}>
                            {rank}
                        </strong>

                    </div>


                    <div className="exp-section">

                        <div className="exp-heading">

                            <span>
                                LEVEL {hunterLevel}
                            </span>

                            <span>
                                {currentExp} / {expPerLevel} EXP
                            </span>

                        </div>

                        <div className="exp-bar">

                            <div
                                className="exp-fill"
                                style={{
                                    width:
                                        `${expPercentage}%`
                                }}
                            ></div>

                        </div>

                        <small>
                            +{earnedExp} EXP EARNED FROM THIS ANALYSIS
                        </small>

                    </div>

                </div>

            </section>


            {/* =================================================
               LEVEL UP
            ================================================= */}

            {levelUp && (

                <section className="level-up-card">

                    <div className="level-up-icon">
                        ⚡
                    </div>

                    <div>

                        <span>
                            HUNTER SYSTEM
                        </span>

                        <h2>
                            LEVEL UP!
                        </h2>

                        <p>
                            {levelUp.message}
                        </p>

                    </div>

                </section>

            )}


            {/* =================================================
               QUICK STATS
            ================================================= */}

            <section className="quick-stats">

                <div className="quick-stat">

                    <span className="quick-icon">
                        ◈
                    </span>

                    <div>

                        <small>
                            SKILLS DETECTED
                        </small>

                        <strong>
                            {skillsCount}
                        </strong>

                    </div>

                </div>


                <div className="quick-stat">

                    <span className="quick-icon">
                        +
                    </span>

                    <div>

                        <small>
                            STRENGTHS
                        </small>

                        <strong>
                            {strengths.length}
                        </strong>

                    </div>

                </div>


                <div className="quick-stat">

                    <span className="quick-icon warning-icon">
                        !
                    </span>

                    <div>

                        <small>
                            IMPROVEMENTS
                        </small>

                        <strong>
                            {recommendations.length}
                        </strong>

                    </div>

                </div>


                <div className="quick-stat">

                    <span className="quick-icon">
                        ↗
                    </span>

                    <div>

                        <small>
                            HUNTER LEVEL
                        </small>

                        <strong>
                            {hunterLevel}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
               ANALYSIS MODULES
            ================================================= */}

            <section className="analysis-section">

                <div className="section-heading">

                    <div>

                        <span>
                            AI DIAGNOSTICS
                        </span>

                        <h2>
                            HUNTER PROFILE BREAKDOWN
                        </h2>

                    </div>

                    <p>
                        Click any module to expand or collapse details.
                    </p>

                </div>


                <div className="analysis-grid">

                    {/* =================================================
                       SKILLS
                    ================================================= */}

                    <AnalysisCard
                        number="01"
                        icon="⌘"
                        title="SKILLS MATCH"
                        description="Technical skills and technologies detected in your resume."
                        items={skills}
                        accent="blue"
                    />


                    {/* =================================================
                       EXPERIENCE
                    ================================================= */}

                    <AnalysisCard
                        number="02"
                        icon="◫"
                        title="EXPERIENCE RELEVANCE"
                        description="Experience information available from the current resume analysis."
                        items={
                            analysis?.experience ||
                            analysis?.experienceRelevance ||
                            [
                                "No separate experience score was returned by the AI.",
                                "Use the strengths and weaknesses below to evaluate practical experience."
                            ]
                        }
                        accent="cyan"
                    />


                    {/* =================================================
                       PROJECT QUALITY
                    ================================================= */}

                    <AnalysisCard
                        number="03"
                        icon="◇"
                        title="PROJECT QUALITY"
                        description="Project-related observations from the resume."
                        items={
                            analysis?.projects ||
                            analysis?.projectQuality ||
                            [
                                "Project quality was not returned as a separate score.",
                                "The AI recommendations contain project improvement guidance."
                            ]
                        }
                        accent="purple"
                    />


                    {/* =================================================
                       ATS
                    ================================================= */}

                    <AnalysisCard
                        number="04"
                        icon="◎"
                        title="ATS COMPATIBILITY"
                        description="Resume structure and machine-readability observations."
                        items={
                            analysis?.ats ||
                            analysis?.atsCompatibility ||
                            [
                                "No separate ATS score was returned.",
                                "Review formatting consistency and keyword usage in the recommendations."
                            ]
                        }
                        accent="green"
                    />


                    {/* =================================================
                       KEYWORDS
                    ================================================= */}

                    <AnalysisCard
                        number="05"
                        icon="⌕"
                        title="KEYWORD MATCHING"
                        description="Skills and terminology detected by the AI engine."
                        items={
                            analysis?.keywords ||
                            analysis?.keywordMatching ||
                            skills
                        }
                        accent="blue"
                    />


                    {/* =================================================
                       STRENGTHS
                    ================================================= */}

                    <AnalysisCard
                        number="06"
                        icon="✦"
                        title="STRENGTHS"
                        description="Strongest elements identified in your profile."
                        items={strengths}
                        accent="green"
                    />

                </div>

            </section>


            {/* =================================================
               WEAKNESSES
            ================================================= */}

            <section className="weakness-section">

                <div className="section-heading">

                    <div>

                        <span>
                            HUNTER DIAGNOSTICS
                        </span>

                        <h2>
                            AREAS TO IMPROVE
                        </h2>

                    </div>

                </div>


                <div className="weakness-list">

                    {weaknesses.length > 0 ? (

                        weaknesses.map(
                            (item, index) => (

                                <div
                                    className="weakness-item"
                                    key={index}
                                >

                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="warning-symbol">
                                        !
                                    </div>

                                    <p>
                                        {String(item)}
                                    </p>

                                </div>

                            )

                        )

                    ) : (

                        <div className="weakness-item">

                            <span>
                                01
                            </span>

                            <div className="warning-symbol">
                                ✓
                            </div>

                            <p>
                                No weaknesses were returned by the AI engine.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
               RECOMMENDATIONS
            ================================================= */}

            <section className="recommendation-card">

                <div className="recommendation-header">

                    <div>

                        <span>
                            AI RECOMMENDATION ENGINE
                        </span>

                        <h2>
                            IMPROVEMENT PROTOCOL
                        </h2>

                    </div>

                    <div className="recommendation-pulse"></div>

                </div>


                <div className="recommendation-list">

                    {recommendations.length > 0 ? (

                        recommendations.map(
                            (item, index) => (

                                <div
                                    className="recommendation-item"
                                    key={index}
                                >

                                    <span>
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <p>
                                        {String(item)}
                                    </p>

                                    <span className="recommendation-arrow">
                                        →
                                    </span>

                                </div>

                            )

                        )

                    ) : (

                        <div className="recommendation-item">

                            <span>
                                01
                            </span>

                            <p>
                                No improvement suggestions were returned by the AI engine.
                            </p>

                        </div>

                    )}

                </div>

            </section>


            {/* =================================================
               ACTIONS
            ================================================= */}

            <div className="analysis-actions">

                <button
                    className="reanalyze-button"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    type="button"
                >

                    {analyzing
                        ? "SCANNING..."
                        : "RUN ANALYSIS AGAIN"}

                    <span>
                        →
                    </span>

                </button>


                <button
                    className="secondary-button"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                    type="button"
                >

                    RETURN TO DASHBOARD

                </button>

            </div>


            {/* =================================================
               ERROR
            ================================================= */}

            {error && (

                <div className="analysis-error result-error">

                    <span className="error-icon">
                        !
                    </span>

                    <div>

                        <strong>
                            CORE ERROR
                        </strong>

                        <p>
                            {error}
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
               STATUS
            ================================================= */}

            <div className="analysis-status">

                <span className="status-dot"></span>

                HUNTER AI CORE

                <span className="status-divider">
                    //
                </span>

                SYSTEM OPERATIONAL

                <span className="status-divider">
                    //
                </span>

                DATABASE CONNECTED

            </div>

        </div>

    );
}


export default Analyze;