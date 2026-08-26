import { useEffect, useState } from "react";
import api from "../services/api";
import "./Jobs.css";

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Selected job for details modal
    const [selectedJob, setSelectedJob] = useState(null);

    // Application state
    const [applying, setApplying] = useState(false);
    const [applyMessage, setApplyMessage] = useState("");
    const [appliedJobs, setAppliedJobs] = useState([]);

    // ==========================
    // FETCH JOBS
    // ==========================

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                const response = await api.get("/jobs", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Jobs:", response.data);

                setJobs(response.data.jobs || []);
            } catch (error) {
                console.error("Jobs error:", error);

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

    // ==========================
    // FETCH MY APPLICATIONS
    // ==========================

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await api.get(
                    "/my-applications",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const applications =
                    response.data.applications || [];

                const jobIds = applications.map(
                    (application) => application.jobId
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

    // ==========================
    // APPLY TO JOB
    // ==========================

    const handleApply = async (jobId) => {
        try {
            setApplying(true);
            setApplyMessage("");

            const token = localStorage.getItem("token");

            const response = await api.post(
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
                "Application submitted successfully! 🎉"
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
                    "You have already applied to this job."
                );
            } else {
                setApplyMessage(
                    error.response?.data?.message ||
                    "Failed to apply for this job."
                );
            }
        } finally {
            setApplying(false);
        }
    };

    // ==========================
    // CLOSE MODAL
    // ==========================

    const closeModal = () => {
        setSelectedJob(null);
        setApplyMessage("");
    };

    // ==========================
    // LOADING
    // ==========================

    if (loading) {
        return (
            <div className="jobs-page">

                <div className="jobs-header">

                    <h1>
                        💼 JOB HUNT
                    </h1>

                    <p>
                        Loading available opportunities...
                    </p>

                </div>

                <div className="jobs-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Connecting to Job Database...
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
            <div className="jobs-page">

                <div className="jobs-header">

                    <h1>
                        💼 JOB HUNT
                    </h1>

                    <p>
                        Discover your next opportunity
                    </p>

                </div>

                <div className="jobs-error">

                    <h2>
                        🔴 JOB DATABASE ERROR
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    // ==========================
    // NO JOBS
    // ==========================

    if (jobs.length === 0) {
        return (
            <div className="jobs-page">

                <div className="jobs-header">

                    <h1>
                        💼 JOB HUNT
                    </h1>

                    <p>
                        Discover your next opportunity
                    </p>

                </div>

                <div className="jobs-empty">

                    <div className="empty-icon">
                        📭
                    </div>

                    <h2>
                        NO JOBS AVAILABLE
                    </h2>

                    <p>
                        There are currently no job
                        opportunities available.
                    </p>

                </div>

            </div>
        );
    }

    // ==========================
    // MAIN PAGE
    // ==========================

    return (
        <div className="jobs-page">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="jobs-header">

                <h1>
                    💼 JOB HUNT
                </h1>

                <p>
                    Discover your next opportunity
                </p>

            </div>


            {/* ==========================
                JOB COUNT
            ========================== */}

            <div className="jobs-info">

                <span>
                    🎯 {jobs.length}{" "}
                    {jobs.length === 1
                        ? "JOB"
                        : "JOBS"}{" "}
                    AVAILABLE
                </span>

            </div>


            {/* ==========================
                JOB GRID
            ========================== */}

            <div className="jobs-grid">

                {jobs.map((job) => {

                    const alreadyApplied =
                        appliedJobs.includes(job.id);

                    return (

                        <div
                            className="job-card"
                            key={job.id}
                        >

                            {/* JOB HEADER */}

                            <div className="job-card-header">

                                <div className="job-icon">
                                    💻
                                </div>

                                <div>

                                    <h2>
                                        {job.title}
                                    </h2>

                                    <p className="company-name">
                                        🏢{" "}
                                        {job.employer?.username ||
                                            "Company"}
                                    </p>

                                </div>

                            </div>


                            {/* DESCRIPTION */}

                            <p className="job-description">

                                {job.description}

                            </p>


                            {/* DETAILS */}

                            <div className="job-details">

                                <div className="job-detail">

                                    <span>📍</span>

                                    <span>
                                        {job.location}
                                    </span>

                                </div>


                                <div className="job-detail">

                                    <span>💰</span>

                                    <span>
                                        {job.salary}
                                    </span>

                                </div>


                                <div className="job-detail">

                                    <span>🧠</span>

                                    <span>
                                        {job.experience}+ years
                                    </span>

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="job-card-footer">

                                <span className="job-id">
                                    JOB #{job.id}
                                </span>

                                <button
                                    className="view-job-button"
                                    onClick={() => {

                                        setSelectedJob(job);
                                        setApplyMessage("");

                                    }}
                                >

                                    {alreadyApplied
                                        ? "✓ APPLIED"
                                        : "VIEW JOB →"}

                                </button>

                            </div>

                        </div>

                    );
                })}

            </div>


            {/* ==========================
                JOB DETAILS MODAL
            ========================== */}

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

                        {/* CLOSE */}

                        <button
                            className="modal-close"
                            onClick={closeModal}
                        >
                            ×
                        </button>


                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div className="modal-job-icon">
                                💻
                            </div>

                            <div>

                                <h2>
                                    {selectedJob.title}
                                </h2>

                                <p>
                                    🏢{" "}
                                    {selectedJob.employer?.username ||
                                        "Company"}
                                </p>

                            </div>

                        </div>


                        {/* JOB DETAILS */}

                        <div className="modal-details">

                            <div>
                                📍{" "}
                                {selectedJob.location}
                            </div>

                            <div>
                                💰{" "}
                                {selectedJob.salary}
                            </div>

                            <div>
                                🧠{" "}
                                {selectedJob.experience}+
                                years experience
                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="modal-section">

                            <h3>
                                ABOUT THIS ROLE
                            </h3>

                            <p>
                                {selectedJob.description}
                            </p>

                        </div>


                        {/* APPLICATION MESSAGE */}

                        {applyMessage && (

                            <div className="apply-message">

                                {applyMessage}

                            </div>

                        )}


                        {/* APPLY BUTTON */}

                        {appliedJobs.includes(
                            selectedJob.id
                        ) ? (

                            <button
                                className="apply-button applied"
                                disabled
                            >

                                ✓ ALREADY APPLIED

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
                                    ? "SUBMITTING..."
                                    : "🚀 APPLY NOW"}

                            </button>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Jobs;