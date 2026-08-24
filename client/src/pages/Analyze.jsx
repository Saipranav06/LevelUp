import { useState } from "react";
import api from "../services/api";
import "./Analyze.css";

function getHunterRank(score) {

    if (score >= 90) return "S-RANK";
    if (score >= 80) return "A-RANK";
    if (score >= 70) return "B-RANK";
    if (score >= 60) return "C-RANK";
    if (score >= 50) return "D-RANK";

    return "E-RANK";
}


function Analyze() {

    const [analysis, setAnalysis] = useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [levelUp, setLevelUp] =
        useState(null);


    // ==========================
    // ANALYZE RESUME
    // ==========================

    const handleAnalyze = async () => {

        try {

            setLoading(true);

            setError("");

            setLevelUp(null);


            const resumeText =
                localStorage.getItem("resumeText");


            if (!resumeText) {

                setError(
                    "No uploaded resume found. Please upload your resume first."
                );

                return;

            }


            const token =
                localStorage.getItem("token");


            const response =
                await api.post(

                    "/analyze-resume",

                    {
                        resumeText
                    },

                    {
                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }
                    }

                );


            console.log(
                "Analysis response:",
                response.data
            );


            // ==========================
            // SAVE ANALYSIS
            // ==========================

            const result =
                response.data.analysis;


            setAnalysis(result);


            localStorage.setItem(

                "resumeAnalysis",

                JSON.stringify(result)

            );


            // ==========================
            // LEVEL UP DATA
            // ==========================

            const hunter =
                response.data.hunter;


            if (
                hunter &&
                hunter.didLevelUp
            ) {

                setLevelUp({

                    message:
                        hunter.levelUpMessage,

                    level:
                        hunter.level,

                    previousLevel:
                        hunter.previousLevel,

                    earnedExp:
                        hunter.earnedExp

                });

            }


        } catch (error) {

            console.error(error);

            setError(

                error.response?.data?.message ||
                "AI analysis failed"

            );

        } finally {

            setLoading(false);

        }

    };


    const hunterRank =
        analysis
            ? getHunterRank(
                analysis.score
            )
            : null;


    return (

        <div className="analyze-page">


            {/* ==========================
                HEADER
            ========================== */}

            <h1 className="analyze-title">
                ⚔️ HUNTER AI ANALYSIS ⚔️
            </h1>


            <p className="analyze-subtitle">
                ARTIFICIAL INTELLIGENCE SYSTEM
            </p>


            {/* ==========================
                ANALYZE BUTTON
            ========================== */}

            <button

                className="analyze-button"

                onClick={handleAnalyze}

                disabled={loading}

            >

                {loading

                    ? "🤖 ANALYZING RESUME..."

                    : "⚡ ANALYZE RESUME"

                }

            </button>


            {/* ==========================
                ERROR
            ========================== */}

            {error && (

                <div className="analysis-error">

                    🔴 {error}

                </div>

            )}


            {/* ==========================
                LEVEL UP
            ========================== */}

            {levelUp && (

                <div className="level-up-card">

                    <div className="level-up-icon">
                        ⚡
                    </div>


                    <p className="level-up-title">
                        LEVEL UP!
                    </p>


                    <h2 className="level-up-level">
                        LEVEL {levelUp.level}
                    </h2>


                    <p className="level-up-message">
                        {levelUp.message}
                    </p>


                    <div className="level-up-exp">
                        +{levelUp.earnedExp} EXP
                    </div>


                </div>

            )}


            {/* ==========================
                ANALYSIS RESULT
            ========================== */}

            {analysis && (

                <div className="analysis-container">


                    {/* ==========================
                        HUNTER REPORT
                    ========================== */}

                    <div className="hunter-report">

                        <p className="report-label">
                            HUNTER REPORT
                        </p>

                        <h2>
                            AI RESUME EVALUATION
                        </h2>

                        <p className="report-status">
                            🟢 ANALYSIS COMPLETE
                        </p>

                    </div>


                    {/* ==========================
                        SCORE
                    ========================== */}

                    <div className="score-card">

                        <p>
                            RESUME SCORE
                        </p>

                        <h2>

                            {analysis.score}

                            <span>
                                /100
                            </span>

                        </h2>


                        <div className="rank-display">

                            <span>
                                HUNTER RANK
                            </span>

                            <strong>
                                {hunterRank}
                            </strong>

                        </div>

                    </div>


                    {/* ==========================
                        SKILLS
                    ========================== */}

                    <div className="analysis-card">

                        <h2>
                            🧠 SKILL ARSENAL
                        </h2>

                        <ul>

                            {analysis.skills.map(

                                (skill, index) => (

                                    <li key={index}>
                                        {skill}
                                    </li>

                                )

                            )}

                        </ul>

                    </div>


                    {/* ==========================
                        STRENGTHS
                    ========================== */}

                    <div className="analysis-card">

                        <h2>
                            💪 HUNTER STRENGTHS
                        </h2>

                        <ul>

                            {analysis.strengths.map(

                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )

                            )}

                        </ul>

                    </div>


                    {/* ==========================
                        WEAKNESSES
                    ========================== */}

                    <div className="analysis-card">

                        <h2>
                            ⚠️ WEAKNESSES
                        </h2>

                        <ul>

                            {analysis.weaknesses.map(

                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )

                            )}

                        </ul>

                    </div>


                    {/* ==========================
                        RECOMMENDATIONS
                    ========================== */}

                    <div className="analysis-card recommendation-card">

                        <h2>
                            🚀 LEVEL-UP RECOMMENDATIONS
                        </h2>

                        <ul>

                            {analysis.recommendations.map(

                                (item, index) => (

                                    <li key={index}>
                                        {item}
                                    </li>

                                )

                            )}

                        </ul>

                    </div>


                    {/* ==========================
                        SYSTEM STATUS
                    ========================== */}

                    <div className="analysis-status">

                        <span className="status-dot">
                            ●
                        </span>

                        HUNTER ANALYSIS SYSTEM ONLINE

                    </div>


                </div>

            )}

        </div>

    );

}

export default Analyze;