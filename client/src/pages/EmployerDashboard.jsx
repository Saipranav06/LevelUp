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

                // Get all jobs
                const jobsResponse = await api.get(
                    "/jobs",
                    config
                );

                // Get employer applications
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
                    Authorization:
                        `Bearer ${token}`,
                },
            }
        );

        console.log(
            "Updated application:",
            response.data
        );

        // Update the UI immediately
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
    // FILTER JOBS FOR SELECTED
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
    // LOADING
    // ==========================

    if (loading) {
        return (
            <div className="employer-page">

                <div className="employer-header">
                    <h1>🏢 EMPLOYER HUB</h1>
                    <p>
                        Manage your jobs and applicants
                    </p>
                </div>

                <div className="employer-loading">
                    <div className="loading-spinner"></div>
                    <p>
                        Loading recruitment data...
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
                    <h1>🏢 EMPLOYER HUB</h1>
                    <p>
                        Manage your jobs and applicants
                    </p>
                </div>

                <div className="employer-error">
                    <h2>🔴 ERROR</h2>
                    <p>{error}</p>
                </div>

            </div>
        );
    }

    // ==========================
    // DASHBOARD
    // ==========================

    return (
        <div className="employer-page">

            {/* HEADER */}

            <div className="employer-header">

                <h1>
                    🏢 EMPLOYER HUB
                </h1>

                <p>
                    Manage your jobs and applicants
                </p>

            </div>


            {/* SUMMARY */}

            <div className="employer-summary">

                <div className="employer-summary-card">
                    <span>💼</span>

                    <div>
                        <small>MY JOBS</small>
                        <strong>
                            {jobs.length}
                        </strong>
                    </div>
                </div>

                <div className="employer-summary-card">
                    <span>👥</span>

                    <div>
                        <small>APPLICANTS</small>
                        <strong>
                            {applications.length}
                        </strong>
                    </div>
                </div>

                <div className="employer-summary-card">
                    <span>🟡</span>

                    <div>
                        <small>SHORTLISTED</small>
                        <strong>
                            {
                                applications.filter(
                                    (application) =>
                                        application.status ===
                                        "SHORTLISTED"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

                <div className="employer-summary-card">
                    <span>🟢</span>

                    <div>
                        <small>ACCEPTED</small>
                        <strong>
                            {
                                applications.filter(
                                    (application) =>
                                        application.status ===
                                        "ACCEPTED"
                                ).length
                            }
                        </strong>
                    </div>
                </div>

            </div>


            {/* JOBS */}

            <div className="employer-section">

                <div className="section-title">
                    <h2>💼 MY JOBS</h2>

                    <span>
                        {jobs.length}{" "}
                        {jobs.length === 1
                            ? "job"
                            : "jobs"}
                    </span>
                </div>


                {jobs.length === 0 ? (

                    <div className="empty-box">
                        📭
                        <h3>
                            No jobs found
                        </h3>
                        <p>
                            Create a job to start
                            receiving applications.
                        </p>
                    </div>

                ) : (

                    <div className="employer-jobs">

                        {jobs.map((job) => {

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

                                    <div className="employer-job-main">

                                        <div className="employer-job-icon">
                                            💻
                                        </div>

                                        <div>
                                            <h3>
                                                {job.title}
                                            </h3>

                                            <p>
                                                📍{" "}
                                                {job.location}
                                            </p>

                                            <p>
                                                💰{" "}
                                                {job.salary}
                                            </p>
                                        </div>

                                    </div>


                                    <div className="job-applicant-count">

                                        <strong>
                                            {
                                                jobApplications.length
                                            }
                                        </strong>

                                        <span>
                                            Applicants
                                        </span>

                                    </div>


                                    <button
                                        className="view-applicants-button"
                                        onClick={() =>
                                            setSelectedJob(
                                                job
                                            )
                                        }
                                    >
                                        👥 VIEW APPLICANTS →
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

                        <button
                            className="employer-modal-close"
                            onClick={() =>
                                setSelectedJob(null)
                            }
                        >
                            ×
                        </button>


                        <div className="modal-job-heading">

                            <span>
                                💻
                            </span>

                            <div>
                                <h2>
                                    {selectedJob.title}
                                </h2>

                                <p>
                                    {selectedApplications.length}{" "}
                                    applicants
                                </p>
                            </div>

                        </div>


                        {selectedApplications.length === 0 ? (

                            <div className="empty-box">
                                📭
                                <h3>
                                    No applicants yet
                                </h3>
                                <p>
                                    Applicants will appear
                                    here when they apply.
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

                                                {/* APPLICANT */}

                                                <div className="applicant-info">

                                                    <div className="applicant-avatar">
                                                        👤
                                                    </div>

                                                    <div>

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


                                                {/* HUNTER INFO */}

                                                <div className="hunter-info">

                                                    <span>
                                                        ⚔️{" "}
                                                        {
                                                            applicant?.hunterRank ||
                                                            "E-RANK"
                                                        }
                                                    </span>

                                                    <span>
                                                        ⭐{" "}
                                                        {
                                                            applicant?.hunterScore ??
                                                            0
                                                        }
                                                    </span>

                                                    <span>
                                                        🧠{" "}
                                                        {
                                                            applicant?.skillsCount ??
                                                            0
                                                        }{" "}
                                                        skills
                                                    </span>

                                                </div>


                                                {/* STATUS */}

                                                <div className="applicant-status">

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
                                                            🟡 SHORTLIST
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
                                                            🟢 ACCEPT
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
                                                            🔴 REJECT
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