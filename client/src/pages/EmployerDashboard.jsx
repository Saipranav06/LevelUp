import { useEffect, useState } from "react";
import api from "../services/api";
import "./EmployerDashboard.css";

function EmployerDashboard() {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const token = localStorage.getItem("token");

    // ==========================
    // LOAD EMPLOYER DATA
    // ==========================

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const jobsResponse = await api.get(
                    "/jobs",
                    config
                );

                const applicationsResponse =
                    await api.get(
                        "/employer/applications",
                        config
                    );

                setJobs(
                    jobsResponse.data.jobs || []
                );

                setApplications(
                    applicationsResponse.data.applications || []
                );

            } catch (error) {
                console.error(
                    "Employer dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load employer dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [token]);

    // ==========================
    // UPDATE APPLICATION STATUS
    // ==========================

    const updateStatus = async (
        applicationId,
        status
    ) => {
        try {
            setUpdatingId(applicationId);

            const response = await api.put(
                `/applications/${applicationId}/status`,
                {
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "Updated application:",
                response.data
            );

            setApplications((previous) =>
                previous.map((application) =>
                    application.id === applicationId
                        ? {
                              ...application,
                              status: status,
                          }
                        : application
                )
            );

        } catch (error) {
            console.error(
                "Status update error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update application status"
            );
        } finally {
            setUpdatingId(null);
        }
    };

    // ==========================
    // SELECTED JOB APPLICATIONS
    // ==========================

    const selectedApplications =
        selectedJob
            ? applications.filter(
                  (application) =>
                      application.jobId ===
                      selectedJob.id
              )
            : [];

    // ==========================
    // STATISTICS
    // ==========================

    const shortlistedCount =
        applications.filter(
            (application) =>
                application.status === "SHORTLISTED"
        ).length;

    const acceptedCount =
        applications.filter(
            (application) =>
                application.status === "ACCEPTED"
        ).length;

    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return (
            <div className="employer-page">

                <div className="employer-top-line"></div>

                <div className="employer-header">

                    <div className="system-chip">
                        <span className="system-dot"></span>
                        EMPLOYER SYSTEM // ONLINE
                    </div>

                    <h1>
                        EMPLOYER
                        <span> COMMAND CENTER</span>
                    </h1>

                    <p>
                        RECRUITMENT INTELLIGENCE SYSTEM
                    </p>

                </div>

                <div className="employer-loading">

                    <div className="loading-core">
                        <div className="loading-ring ring-one"></div>
                        <div className="loading-ring ring-two"></div>
                        <div className="loading-ring ring-three"></div>
                        <span>AI</span>
                    </div>

                    <h2>
                        INITIALIZING EMPLOYER SYSTEM
                    </h2>

                    <p>
                        Connecting to recruitment database...
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
            <div className="employer-page">

                <div className="employer-header">

                    <div className="system-chip danger">
                        SYSTEM // ERROR
                    </div>

                    <h1>
                        EMPLOYER
                        <span> COMMAND CENTER</span>
                    </h1>

                    <p>
                        RECRUITMENT INTELLIGENCE SYSTEM
                    </p>

                </div>

                <div className="employer-error">

                    <div className="error-symbol">
                        !
                    </div>

                    <h2>
                        SYSTEM ERROR
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    // ==========================
    // DASHBOARD
    // ==========================

    return (
        <div className="employer-page">

            {/* TOP DECORATION */}

            <div className="employer-top-line"></div>

            {/* ==========================
                HEADER
            ========================== */}

            <div className="employer-header">

                <div className="system-chip">

                    <span className="system-dot"></span>

                    EMPLOYER SYSTEM // ONLINE

                </div>

                <h1>
                    EMPLOYER
                    <span> COMMAND CENTER</span>
                </h1>

                <p>
                    RECRUITMENT INTELLIGENCE // TALENT ACQUISITION
                </p>

            </div>


            {/* ==========================
                SYSTEM STATUS
            ========================== */}

            <div className="employer-status-bar">

                <div>
                    <span className="status-light"></span>
                    AI CORE ACTIVE
                </div>

                <div>
                    RECRUITMENT NETWORK
                    <strong> CONNECTED</strong>
                </div>

                <div>
                    SYSTEM STATUS
                    <strong> OPTIMAL</strong>
                </div>

            </div>


            {/* ==========================
                SUMMARY
            ========================== */}

            <div className="employer-summary">

                <div className="employer-summary-card blue">

                    <div className="summary-icon">
                        ◈
                    </div>

                    <div className="summary-content">

                        <small>
                            ACTIVE JOBS
                        </small>

                        <strong>
                            {jobs.length}
                        </strong>

                        <span>
                            OPEN POSITIONS
                        </span>

                    </div>

                </div>


                <div className="employer-summary-card purple">

                    <div className="summary-icon">
                        ◎
                    </div>

                    <div className="summary-content">

                        <small>
                            TOTAL APPLICANTS
                        </small>

                        <strong>
                            {applications.length}
                        </strong>

                        <span>
                            CANDIDATE SIGNALS
                        </span>

                    </div>

                </div>


                <div className="employer-summary-card yellow">

                    <div className="summary-icon">
                        ◉
                    </div>

                    <div className="summary-content">

                        <small>
                            SHORTLISTED
                        </small>

                        <strong>
                            {shortlistedCount}
                        </strong>

                        <span>
                            HIGH POTENTIAL
                        </span>

                    </div>

                </div>


                <div className="employer-summary-card green">

                    <div className="summary-icon">
                        ✓
                    </div>

                    <div className="summary-content">

                        <small>
                            ACCEPTED
                        </small>

                        <strong>
                            {acceptedCount}
                        </strong>

                        <span>
                            SUCCESSFUL HUNTERS
                        </span>

                    </div>

                </div>

            </div>


            {/* ==========================
                JOB SECTION
            ========================== */}

            <div className="employer-section">

                <div className="section-heading">

                    <div>

                        <div className="section-code">
                            MODULE // 01
                        </div>

                        <h2>
                            RECRUITMENT OPERATIONS
                        </h2>

                        <p>
                            Manage active positions and analyze incoming hunters.
                        </p>

                    </div>

                    <div className="job-count">

                        <strong>
                            {jobs.length}
                        </strong>

                        <span>
                            ACTIVE
                        </span>

                    </div>

                </div>


                {/* ==========================
                    JOBS
                ========================== */}

                {jobs.length === 0 ? (

                    <div className="empty-box">

                        <div className="empty-icon">
                            ◇
                        </div>

                        <h3>
                            NO ACTIVE POSITIONS
                        </h3>

                        <p>
                            Create a job to begin receiving hunter applications.
                        </p>

                    </div>

                ) : (

                    <div className="employer-jobs">

                        {jobs.map((job, index) => {

                            const jobApplications =
                                applications.filter(
                                    (application) =>
                                        application.jobId ===
                                        job.id
                                );

                            return (

                                <div
                                    className="employer-job-card"
                                    key={job.id}
                                >

                                    {/* CARD NUMBER */}

                                    <div className="job-index">
                                        0{index + 1}
                                    </div>


                                    {/* JOB MAIN */}

                                    <div className="employer-job-main">

                                        <div className="job-icon-box">
                                            <span>
                                                ◈
                                            </span>
                                        </div>

                                        <div>

                                            <div className="job-module">
                                                POSITION // ACTIVE
                                            </div>

                                            <h3>
                                                {job.title}
                                            </h3>

                                            <p className="job-company">
                                                RECRUITMENT TARGET
                                            </p>

                                            <div className="job-meta">

                                                <span>
                                                    ◉ {job.location}
                                                </span>

                                                <span>
                                                    ◇ {job.salary}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* APPLICANTS */}

                                    <div className="job-applicant-count">

                                        <span>
                                            APPLICANTS
                                        </span>

                                        <strong>
                                            {jobApplications.length}
                                        </strong>

                                        <small>
                                            CANDIDATE SIGNALS
                                        </small>

                                    </div>


                                    {/* ACTION */}

                                    <button
                                        className="view-applicants-button"
                                        onClick={() =>
                                            setSelectedJob(job)
                                        }
                                    >

                                        <span>
                                            ANALYZE
                                        </span>

                                        <strong>
                                            →
                                        </strong>

                                    </button>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>


            {/* ==========================
                APPLICANTS MODAL
            ========================== */}

            {selectedJob && (

                <div
                    className="employer-modal-overlay"
                    onClick={() =>
                        setSelectedJob(null)
                    }
                >

                    <div
                        className="employer-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* CLOSE */}

                        <button
                            className="employer-modal-close"
                            onClick={() =>
                                setSelectedJob(null)
                            }
                        >
                            ×
                        </button>


                        {/* MODAL HEADER */}

                        <div className="modal-top-status">

                            <span className="status-light"></span>

                            AI CANDIDATE ANALYSIS

                            <span>
                                ONLINE
                            </span>

                        </div>


                        <div className="modal-job-heading">

                            <div className="modal-job-icon">
                                ◈
                            </div>

                            <div>

                                <div className="modal-module">
                                    POSITION // ANALYSIS
                                </div>

                                <h2>
                                    {selectedJob.title}
                                </h2>

                                <p>
                                    {selectedApplications.length}{" "}
                                    candidates detected
                                </p>

                            </div>

                        </div>


                        {/* APPLICANTS */}

                        {selectedApplications.length === 0 ? (

                            <div className="empty-box modal-empty">

                                <div className="empty-icon">
                                    ◇
                                </div>

                                <h3>
                                    NO CANDIDATES DETECTED
                                </h3>

                                <p>
                                    Applicants will appear here when hunters apply.
                                </p>

                            </div>

                        ) : (

                            <div className="applicant-list">

                                {selectedApplications.map(
                                    (application) => {

                                        const applicant =
                                            application.applicant;

                                        return (

                                            <div
                                                className="applicant-card"
                                                key={
                                                    application.id
                                                }
                                            >

                                                {/* APPLICANT HEADER */}

                                                <div className="applicant-info">

                                                    <div className="applicant-avatar">
                                                        ◉
                                                    </div>

                                                    <div>

                                                        <div className="candidate-code">
                                                            HUNTER // CANDIDATE
                                                        </div>

                                                        <h3>
                                                            {
                                                                applicant?.username ||
                                                                "Applicant"
                                                            }
                                                        </h3>

                                                        <p>
                                                            {
                                                                applicant?.email ||
                                                                "No email"
                                                            }
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* HUNTER DATA */}

                                                <div className="hunter-info">

                                                    <div>

                                                        <small>
                                                            RANK
                                                        </small>

                                                        <span>
                                                            ⚔️{" "}
                                                            {
                                                                applicant?.hunterRank ||
                                                                "E-RANK"
                                                            }
                                                        </span>

                                                    </div>


                                                    <div>

                                                        <small>
                                                            SCORE
                                                        </small>

                                                        <span>
                                                            ⭐{" "}
                                                            {
                                                                applicant?.hunterScore ??
                                                                0
                                                            }
                                                        </span>

                                                    </div>


                                                    <div>

                                                        <small>
                                                            SKILLS
                                                        </small>

                                                        <span>
                                                            🧠{" "}
                                                            {
                                                                applicant?.skillsCount ??
                                                                0
                                                            }
                                                        </span>

                                                    </div>

                                                </div>


                                                {/* STATUS */}

                                                <div className="applicant-status">

                                                    <span className="status-label">
                                                        APPLICATION STATUS
                                                    </span>

                                                    <span
                                                        className={
                                                            `status-badge status-${application.status.toLowerCase()}`
                                                        }
                                                    >
                                                        {application.status}
                                                    </span>

                                                </div>


                                                {/* ACTIONS */}

                                                <div className="applicant-actions">

                                                    {application.status !==
                                                        "SHORTLISTED" &&
                                                        application.status !==
                                                        "ACCEPTED" && (

                                                        <button
                                                            className="shortlist-button"
                                                            disabled={
                                                                updatingId ===
                                                                application.id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    application.id,
                                                                    "SHORTLISTED"
                                                                )
                                                            }
                                                        >
                                                            SHORTLIST
                                                        </button>

                                                    )}


                                                    {application.status !==
                                                        "ACCEPTED" && (

                                                        <button
                                                            className="accept-button"
                                                            disabled={
                                                                updatingId ===
                                                                application.id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    application.id,
                                                                    "ACCEPTED"
                                                                )
                                                            }
                                                        >
                                                            ACCEPT
                                                        </button>

                                                    )}


                                                    {application.status !==
                                                        "REJECTED" &&
                                                        application.status !==
                                                        "ACCEPTED" && (

                                                        <button
                                                            className="reject-button"
                                                            disabled={
                                                                updatingId ===
                                                                application.id
                                                            }
                                                            onClick={() =>
                                                                updateStatus(
                                                                    application.id,
                                                                    "REJECTED"
                                                                )
                                                            }
                                                        >
                                                            REJECT
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default EmployerDashboard;