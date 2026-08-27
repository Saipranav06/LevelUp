import { useEffect, useState } from "react";
import api from "../services/api";
import "./Jobs.css";

function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);

    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");
    const [appliedJobs, setAppliedJobs] = useState([]);


    /* =====================================================
       FETCH JOBS
    ===================================================== */

    useEffect(() => {

        const fetchJobs = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                const response =
                    await api.get("/jobs", {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    });

                console.log("Jobs:", response.data);

                setJobs(
                    response.data.jobs || []
                );

            } catch (error) {

                console.error(
                    "Jobs error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load jobs"
                );

            } finally {

                setLoading(false);

            }
        };

        fetchJobs();

    }, []);


    /* =====================================================
       FETCH APPLICATIONS
    ===================================================== */

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response =
                    await api.get(
                        "/my-applications",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );

                const applications =
                    response.data.applications || [];

                const jobIds =
                    applications.map(
                        (application) =>
                            application.jobId
                    );

                setAppliedJobs(jobIds);

            } catch (error) {

                console.error(
                    "Applications error:",
                    error
                );

            }

        };

        fetchApplications();

    }, []);


    /* =====================================================
       APPLY
    ===================================================== */

    const handleApply = async (jobId) => {

        try {

            setApplying(true);
            setApplyMessage("");

            const token =
                localStorage.getItem("token");

            const response =
                await api.post(
                    `/jobs/${jobId}/apply`,
                    {},
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            console.log(
                "Application:",
                response.data
            );

            setAppliedJobs((previous) => [
                ...previous,
                jobId,
            ]);

            setApplyMessage(
                "✓ APPLICATION SUBMITTED SUCCESSFULLY"
            );

        } catch (error) {

            console.error(
                "Apply error:",
                error
            );

            if (
                error.response?.status === 409
            ) {

                setAppliedJobs((previous) => [
                    ...new Set([
                        ...previous,
                        jobId,
                    ]),
                ]);

                setApplyMessage(
                    "✓ YOU HAVE ALREADY APPLIED TO THIS MISSION"
                );

            } else {

                setApplyMessage(
                    error.response?.data?.message ||
                    "APPLICATION FAILED"
                );

            }

        } finally {

            setApplying(false);

        }
    };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const closeModal = () => {

        setSelectedJob(null);
        setApplyMessage("");

    };


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {

        return (
            <div className="jobs-page">

                <div className="jobs-shell">

                    <aside className="hunter-sidebar">

                        <div className="sidebar-brand">
                            <h2>LEVEL UP</h2>
                            <p>HUNTER SYSTEM</p>
                        </div>

                        <div className="hunter-avatar">
                            ⚔️
                        </div>

                        <div className="sidebar-hunter-name">
                            HUNTER
                        </div>

                        <div className="sidebar-rank">
                            E-RANK
                        </div>

                        <div className="sidebar-status">

                            <div className="sidebar-status-label">
                                SYSTEM STATUS
                            </div>

                            <div className="sidebar-online">
                                <span className="sidebar-online-dot" />
                                ONLINE
                            </div>

                        </div>

                    </aside>

                    <main className="jobs-main">

                        <div className="jobs-header">

                            <h1>JOB HUNT</h1>

                            <p>
                                HUNTER OPPORTUNITY NETWORK
                            </p>

                        </div>

                        <div className="jobs-loading">

                            <div className="loading-spinner" />

                            <p>
                                CONNECTING TO JOB DATABASE...
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (error) {

        return (
            <div className="jobs-page">

                <div className="jobs-shell">

                    <aside className="hunter-sidebar">

                        <div className="sidebar-brand">
                            <h2>LEVEL UP</h2>
                            <p>HUNTER SYSTEM</p>
                        </div>

                        <div className="hunter-avatar">
                            ⚔️
                        </div>

                        <div className="sidebar-hunter-name">
                            HUNTER
                        </div>

                        <div className="sidebar-rank">
                            E-RANK
                        </div>

                    </aside>

                    <main className="jobs-main">

                        <div className="jobs-header">

                            <h1>JOB HUNT</h1>

                            <p>
                                HUNTER OPPORTUNITY NETWORK
                            </p>

                        </div>

                        <div className="jobs-error">

                            <h2>
                                ⚠ JOB DATABASE ERROR
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /* =====================================================
       EMPTY
    ===================================================== */

    if (jobs.length === 0) {

        return (
            <div className="jobs-page">

                <div className="jobs-shell">

                    <aside className="hunter-sidebar">

                        <div className="sidebar-brand">
                            <h2>LEVEL UP</h2>
                            <p>HUNTER SYSTEM</p>
                        </div>

                        <div className="hunter-avatar">
                            ⚔️
                        </div>

                        <div className="sidebar-hunter-name">
                            HUNTER
                        </div>

                        <div className="sidebar-rank">
                            E-RANK
                        </div>

                    </aside>

                    <main className="jobs-main">

                        <div className="jobs-header">

                            <h1>JOB HUNT</h1>

                            <p>
                                HUNTER OPPORTUNITY NETWORK
                            </p>

                        </div>

                        <div className="jobs-empty">

                            <div className="empty-icon">
                                📡
                            </div>

                            <h2>
                                NO ACTIVE MISSIONS
                            </h2>

                            <p>
                                The Hunter Network currently
                                has no available opportunities.
                            </p>

                        </div>

                    </main>

                </div>

            </div>
        );
    }


    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (

        <div className="jobs-page">

            <div className="jobs-shell">


                {/* =================================================
                   SIDEBAR
                ================================================= */}

                <aside className="hunter-sidebar">

                    <div className="sidebar-brand">

                        <h2>
                            LEVEL UP
                        </h2>

                        <p>
                            HUNTER SYSTEM
                        </p>

                    </div>


                    <div className="hunter-avatar">
                        ⚔️
                    </div>


                    <div className="sidebar-hunter-name">
                        HUNTER
                    </div>


                    <div className="sidebar-rank">
                        E-RANK
                    </div>


                    <nav className="sidebar-nav">

                        <a
                            href="/dashboard"
                            className="sidebar-nav-item"
                        >
                            ◈ &nbsp; DASHBOARD
                        </a>

                        <a
                            href="/analyze"
                            className="sidebar-nav-item"
                        >
                            ◉ &nbsp; AI ANALYSIS
                        </a>

                        <a
                            href="/jobs"
                            className="sidebar-nav-item active"
                        >
                            ◆ &nbsp; JOB HUNT
                        </a>

                        <a
                            href="/profile"
                            className="sidebar-nav-item"
                        >
                            ◇ &nbsp; HUNTER PROFILE
                        </a>

                    </nav>


                    <div className="sidebar-status">

                        <div className="sidebar-status-label">
                            SYSTEM STATUS
                        </div>

                        <div className="sidebar-online">

                            <span className="sidebar-online-dot" />

                            ONLINE

                        </div>

                    </div>

                </aside>


                {/* =================================================
                   MAIN
                ================================================= */}

                <main className="jobs-main">


                    {/* HEADER */}

                    <div className="jobs-header">

                        <div className="scanner-status">

                            SCANNER STATUS

                            <strong>
                                ● ONLINE
                            </strong>

                        </div>

                        <h1>
                            JOB HUNT
                        </h1>

                        <p>
                            HUNTER OPPORTUNITY NETWORK
                        </p>

                    </div>


                    {/* METRICS */}

                    <div className="jobs-metrics">

                        <div className="metric-card">

                            <div className="metric-icon">
                                🎯
                            </div>

                            <div className="metric-value">
                                {jobs.length}
                            </div>

                            <div className="metric-label">
                                ACTIVE MISSIONS
                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon">
                                💼
                            </div>

                            <div className="metric-value">
                                {jobs.length}
                            </div>

                            <div className="metric-label">
                                TOTAL MISSIONS
                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon">
                                ✦
                            </div>

                            <div className="metric-value">
                                {jobs.length}
                            </div>

                            <div className="metric-label">
                                MATCHING YOU
                            </div>

                        </div>


                        <div className="metric-card">

                            <div className="metric-icon">
                                ✓
                            </div>

                            <div className="metric-value">
                                {appliedJobs.length}
                            </div>

                            <div className="metric-label">
                                APPLIED
                            </div>

                        </div>

                    </div>


                    {/* DATABASE BAR */}

                    <div className="jobs-info">

                        <div className="jobs-info-left">

                            // ACTIVE MISSIONS &nbsp;

                            <strong>
                                {jobs.length}
                            </strong>

                        </div>

                        <div className="database-status">
                            ● DATABASE ONLINE
                        </div>

                    </div>


                    {/* JOBS */}

                    <div className="jobs-grid">

                        {jobs.map((job, index) => {

                            const alreadyApplied =
                                appliedJobs.includes(
                                    job.id
                                );

                            const matchScore =
                                job.matchScore ??
                                job.matchPercentage ??
                                "—";


                            return (

                                <div
                                    className="job-card"
                                    key={job.id}
                                >

                                    {index === 0 && (
                                        <div className="new-mission">
                                            NEW MISSION
                                        </div>
                                    )}


                                    {/* HEADER */}

                                    <div className="job-card-header">

                                        <div className="job-icon">
                                            💻
                                        </div>


                                        <div>

                                            <h2>
                                                {job.title}
                                            </h2>

                                            <p className="company-name">
                                                ▣ &nbsp;
                                                {job.employer?.username ||
                                                    "UNKNOWN EMPLOYER"}
                                            </p>

                                            <p className="job-description">
                                                {job.description}
                                            </p>

                                        </div>


                                        <div className="match-score">

                                            <div className="match-score-label">
                                                MATCH SCORE
                                            </div>

                                            <div className="match-score-value">
                                                {matchScore}
                                                {matchScore !== "—" &&
                                                    "%"}
                                            </div>

                                        </div>

                                    </div>


                                    {/* SKILLS */}

                                    <div className="job-skills">

                                        <span className="skill-tag">
                                            FRONTEND
                                        </span>

                                        <span className="skill-tag">
                                            JAVASCRIPT
                                        </span>

                                        <span className="skill-tag">
                                            WEB
                                        </span>

                                        <span className="skill-tag">
                                            DEVELOPMENT
                                        </span>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="job-details">

                                        <div className="job-detail">

                                            <span className="job-detail-label">
                                                LOCATION
                                            </span>

                                            <span className="job-detail-value">
                                                <span className="job-detail-icon">
                                                    ◉
                                                </span>
                                                {job.location}
                                            </span>

                                        </div>


                                        <div className="job-detail">

                                            <span className="job-detail-label">
                                                EXPERIENCE
                                            </span>

                                            <span className="job-detail-value">
                                                <span className="job-detail-icon">
                                                    ◫
                                                </span>
                                                {job.experience}+ years
                                            </span>

                                        </div>


                                        <div className="job-detail">

                                            <span className="job-detail-label">
                                                SALARY
                                            </span>

                                            <span className="job-detail-value">
                                                <span className="job-detail-icon">
                                                    ◈
                                                </span>
                                                {job.salary}
                                            </span>

                                        </div>


                                        <div className="job-detail">

                                            <span className="job-detail-label">
                                                TYPE
                                            </span>

                                            <span className="job-detail-value">
                                                <span className="job-detail-icon">
                                                    ◆
                                                </span>
                                                Full Time
                                            </span>

                                        </div>

                                    </div>


                                    {/* FOOTER */}

                                    <div className="job-card-footer">

                                        <span className="job-id">
                                            MISSION #{job.id}
                                        </span>


                                        <button
                                            className="view-job-button"
                                            onClick={() => {

                                                setSelectedJob(job);
                                                setApplyMessage("");

                                            }}
                                        >

                                            {alreadyApplied
                                                ? "✓ MISSION ACCEPTED"
                                                : "VIEW MISSION →"}

                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </main>

            </div>


            {/* =====================================================
               MODAL
            ===================================================== */}

            {selectedJob && (

                <div
                    className="job-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="job-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={closeModal}
                        >
                            ×
                        </button>


                        <div className="modal-header">

                            <div className="modal-job-icon">
                                💻
                            </div>

                            <div>

                                <h2>
                                    {selectedJob.title}
                                </h2>

                                <p>
                                    ▣ &nbsp;
                                    {selectedJob.employer?.username ||
                                        "UNKNOWN EMPLOYER"}
                                </p>

                            </div>

                        </div>


                        <div className="modal-details">

                            <div>
                                📍 &nbsp;
                                {selectedJob.location}
                            </div>

                            <div>
                                💰 &nbsp;
                                {selectedJob.salary}
                            </div>

                            <div>
                                🧠 &nbsp;
                                {selectedJob.experience}+
                                years
                            </div>

                        </div>


                        <div className="modal-section">

                            <h3>
                                MISSION DESCRIPTION
                            </h3>

                            <p>
                                {selectedJob.description}
                            </p>

                        </div>


                        {applyMessage && (

                            <div className="apply-message">
                                {applyMessage}
                            </div>

                        )}


                        {appliedJobs.includes(
                            selectedJob.id
                        ) ? (

                            <button
                                className="apply-button applied"
                                disabled
                            >
                                ✓ MISSION ALREADY ACCEPTED
                            </button>

                        ) : (

                            <button
                                className="apply-button"
                                onClick={() =>
                                    handleApply(
                                        selectedJob.id
                                    )
                                }
                                disabled={applying}
                            >

                                {applying
                                    ? "⏳ TRANSMITTING APPLICATION..."
                                    : "⚡ ACCEPT MISSION"}

                            </button>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Jobs;