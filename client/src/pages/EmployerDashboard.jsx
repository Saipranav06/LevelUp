import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "./EmployerDashboard.css";

function EmployerDashboard() {

    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedJob, setSelectedJob] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    // ADD JOB
    const [showAddJob, setShowAddJob] = useState(false);
    const [creatingJob, setCreatingJob] = useState(false);
    const [jobMessage, setJobMessage] = useState("");
    const [jobError, setJobError] = useState("");

    const [newJob, setNewJob] = useState({
        title: "",
        description: "",
        experience: "",
        salary: "",
        location: ""
    });

    const token = localStorage.getItem("token");

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    // =========================================================
    // LOAD EMPLOYER DATA
    // =========================================================

    const loadData = async () => {

        try {

            setLoading(true);
            setError("");

            const jobsResponse =
                await api.get(
                    "/jobs",
                    config
                );

            const applicationsResponse =
                await api.get(
                    "/employer/applications",
                    config
                );

            /*
             * /jobs currently returns all jobs.
             * We only display jobs that belong to the
             * currently logged-in employer.
             *
             * The JWT contains the employer id.
             */

            let currentUserId = null;

            try {

                const payload =
                    JSON.parse(
                        atob(
                            token
                                .split(".")[1]
                                .replace(/-/g, "+")
                                .replace(/_/g, "/")
                        )
                    );

                currentUserId =
                    Number(payload.id);

            } catch (decodeError) {

                console.error(
                    "Token decode error:",
                    decodeError
                );

            }

            const allJobs =
                jobsResponse.data.jobs || [];

            const ownJobs =
                currentUserId
                    ? allJobs.filter(
                          (job) =>
                              Number(
                                  job.employerId ??
                                  job.employer?.id
                              ) === currentUserId
                      )
                    : [];

            setJobs(ownJobs);

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


    useEffect(() => {

        loadData();

    }, []);


    // =========================================================
    // ADD JOB
    // =========================================================

    const handleJobChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setNewJob((previous) => ({
            ...previous,
            [name]: value
        }));

        setJobError("");
        setJobMessage("");

    };


    const createJob = async (e) => {

        e.preventDefault();

        setJobError("");
        setJobMessage("");

        if (
            !newJob.title.trim() ||
            !newJob.description.trim() ||
            newJob.experience === "" ||
            !newJob.salary.trim() ||
            !newJob.location.trim()
        ) {

            setJobError(
                "All job fields are required."
            );

            return;
        }

        try {

            setCreatingJob(true);

            const response =
                await api.post(
                    "/jobs",
                    {
                        title:
                            newJob.title.trim(),

                        description:
                            newJob.description.trim(),

                        experience:
                            Number(newJob.experience),

                        salary:
                            newJob.salary.trim(),

                        location:
                            newJob.location.trim()
                    },
                    config
                );

            const createdJob =
                response.data.job;

            /*
             * Immediately add the newly created
             * job to the dashboard.
             */

            setJobs((previous) => [
                createdJob,
                ...previous
            ]);

            setNewJob({
                title: "",
                description: "",
                experience: "",
                salary: "",
                location: ""
            });

            setJobMessage(
                "POSITION CREATED SUCCESSFULLY"
            );

            setTimeout(() => {

                setShowAddJob(false);
                setJobMessage("");

            }, 900);

        } catch (error) {

            console.error(
                "Create job error:",
                error
            );

            setJobError(
                error.response?.data?.message ||
                "Failed to create job."
            );

        } finally {

            setCreatingJob(false);

        }
    };


    // =========================================================
    // UPDATE APPLICATION STATUS
    // =========================================================

    const updateStatus = async (
        applicationId,
        status
    ) => {

        try {

            setUpdatingId(applicationId);

            await api.put(
                `/applications/${applicationId}/status`,
                {
                    status
                },
                config
            );

            setApplications((previous) =>
                previous.map(
                    (application) =>
                        application.id ===
                        applicationId
                            ? {
                                  ...application,
                                  status
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


    // =========================================================
    // SELECTED JOB APPLICATIONS
    // =========================================================

    const selectedApplications =
        selectedJob
            ? applications.filter(
                  (application) =>
                      application.jobId ===
                      selectedJob.id
              )
            : [];


    // =========================================================
    // STATISTICS
    // =========================================================

    const shortlistedCount =
        applications.filter(
            (application) =>
                application.status ===
                "SHORTLISTED"
        ).length;

    const acceptedCount =
        applications.filter(
            (application) =>
                application.status ===
                "ACCEPTED"
        ).length;

    const pendingCount =
        applications.filter(
            (application) =>
                application.status ===
                "APPLIED"
        ).length;


    const totalApplicants =
        applications.length;


    // =========================================================
    // JOB APPLICATION COUNTS
    // =========================================================

    const applicationCountMap =
        useMemo(() => {

            const map = {};

            applications.forEach(
                (application) => {

                    map[application.jobId] =
                        (map[application.jobId] || 0) + 1;

                }
            );

            return map;

        }, [applications]);


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="employer-page">

                <div className="employer-background-grid"></div>

                <div className="employer-header">

                    <div className="system-chip">
                        <span className="system-dot"></span>
                        EMPLOYER SYSTEM // CONNECTING
                    </div>

                    <h1>
                        EMPLOYER
                        <span> COMMAND CENTER</span>
                    </h1>

                    <p>
                        RECRUITMENT INTELLIGENCE // TALENT ACQUISITION
                    </p>

                </div>

                <div className="employer-loading">

                    <div className="loading-core">

                        <div className="loading-ring ring-one"></div>
                        <div className="loading-ring ring-two"></div>
                        <div className="loading-ring ring-three"></div>

                        <span>
                            ◈
                        </span>

                    </div>

                    <h2>
                        CONNECTING TO RECRUITMENT NETWORK
                    </h2>

                    <p>
                        Loading employer data...
                    </p>

                </div>

            </div>

        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="employer-page">

                <div className="employer-background-grid"></div>

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

                    <button
                        className="retry-button"
                        onClick={loadData}
                    >
                        RETRY CONNECTION
                    </button>

                </div>

            </div>

        );
    }


    // =========================================================
    // MAIN DASHBOARD
    // =========================================================

    return (

        <div className="employer-page">

            <div className="employer-background-grid"></div>

            <div className="employer-glow glow-blue"></div>
            <div className="employer-glow glow-purple"></div>


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="employer-header">

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

            </header>


            {/* =================================================
                STATUS BAR
            ================================================= */}

            <div className="employer-status-bar">

                <div>

                    <span className="status-light"></span>

                    AI CORE ACTIVE

                </div>

                <div>

                    RECRUITMENT NETWORK

                    <strong>
                        CONNECTED
                    </strong>

                </div>

                <div>

                    SYSTEM STATUS

                    <strong>
                        OPTIMAL
                    </strong>

                </div>

            </div>


            {/* =================================================
                QUICK ACTION
            ================================================= */}

            <section className="employer-command-bar">

                <div>

                    <span>
                        COMMAND // 01
                    </span>

                    <h2>
                        READY FOR YOUR NEXT HIRE?
                    </h2>

                    <p>
                        Deploy a new position and begin receiving hunter applications.
                    </p>

                </div>

                <button
                    className="create-job-button"
                    onClick={() => {
                        setShowAddJob(true);
                        setJobError("");
                        setJobMessage("");
                    }}
                >

                    <span className="create-plus">
                        +
                    </span>

                    CREATE NEW JOB

                    <span>
                        →
                    </span>

                </button>

            </section>


            {/* =================================================
                SUMMARY
            ================================================= */}

            <section className="employer-summary">

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
                            {totalApplicants}
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

            </section>


            {/* =================================================
                RECRUITMENT OPERATIONS
            ================================================= */}

            <section className="employer-section">

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


                {/* =================================================
                    JOBS
                ================================================= */}

                {jobs.length === 0 ? (

                    <div className="empty-box">

                        <div className="empty-icon">
                            ◇
                        </div>

                        <div className="empty-code">
                            NO ACTIVE POSITIONS
                        </div>

                        <h3>
                            YOUR RECRUITMENT GRID IS EMPTY
                        </h3>

                        <p>
                            Create your first job position to begin receiving hunter applications.
                        </p>

                        <button
                            className="empty-create-button"
                            onClick={() =>
                                setShowAddJob(true)
                            }
                        >
                            + CREATE FIRST POSITION
                        </button>

                    </div>

                ) : (

                    <div className="employer-jobs">

                        {jobs.map(
                            (job, index) => {

                                const count =
                                    applicationCountMap[
                                        job.id
                                    ] || 0;

                                return (

                                    <article
                                        className="employer-job-card"
                                        key={job.id}
                                    >

                                        <div className="job-card-glow"></div>

                                        <div className="job-index">

                                            {String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}

                                        </div>


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
                                                    YOUR ORGANIZATION
                                                </p>

                                                <div className="job-meta">

                                                    <span>
                                                        📍 {job.location}
                                                    </span>

                                                    <span>
                                                        💰 {job.salary}
                                                    </span>

                                                    <span>
                                                        🧠 {job.experience}+ YEARS
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        <div className="job-applicant-count">

                                            <span>
                                                APPLICANTS
                                            </span>

                                            <strong>
                                                {count}
                                            </strong>

                                            <small>
                                                CANDIDATES
                                            </small>

                                        </div>


                                        <button
                                            className="view-applicants-button"
                                            onClick={() =>
                                                setSelectedJob(
                                                    job
                                                )
                                            }
                                        >

                                            <span>
                                                ANALYZE
                                            </span>

                                            <span>
                                                →
                                            </span>

                                        </button>

                                    </article>

                                );

                            }
                        )}

                    </div>

                )}

            </section>


            {/* =================================================
                RECRUITMENT METRICS
            ================================================= */}

            <section className="employer-metrics">

                <div className="metrics-heading">

                    <div>

                        <span>
                            SYSTEM METRICS
                        </span>

                        <h2>
                            TALENT PIPELINE
                        </h2>

                    </div>

                    <div className="metrics-live">
                        <span></span>
                        LIVE
                    </div>

                </div>


                <div className="metrics-grid">

                    <div className="metric-box">

                        <span>
                            PENDING REVIEW
                        </span>

                        <strong>
                            {pendingCount}
                        </strong>

                        <div className="metric-bar">
                            <span
                                style={{
                                    width:
                                        totalApplicants
                                            ? `${Math.min(
                                                  (pendingCount /
                                                      totalApplicants) *
                                                      100,
                                                  100
                                              )}%`
                                            : "0%"
                                }}
                            ></span>
                        </div>

                    </div>


                    <div className="metric-box">

                        <span>
                            SHORTLIST RATE
                        </span>

                        <strong>
                            {totalApplicants
                                ? Math.round(
                                      (shortlistedCount /
                                          totalApplicants) *
                                          100
                                  )
                                : 0}
                            %
                        </strong>

                        <div className="metric-bar purple-bar">
                            <span
                                style={{
                                    width:
                                        totalApplicants
                                            ? `${Math.min(
                                                  (shortlistedCount /
                                                      totalApplicants) *
                                                      100,
                                                  100
                                              )}%`
                                            : "0%"
                                }}
                            ></span>
                        </div>

                    </div>


                    <div className="metric-box">

                        <span>
                            ACCEPTANCE RATE
                        </span>

                        <strong>
                            {totalApplicants
                                ? Math.round(
                                      (acceptedCount /
                                          totalApplicants) *
                                          100
                                  )
                                : 0}
                            %
                        </strong>

                        <div className="metric-bar green-bar">
                            <span
                                style={{
                                    width:
                                        totalApplicants
                                            ? `${Math.min(
                                                  (acceptedCount /
                                                      totalApplicants) *
                                                      100,
                                                  100
                                              )}%`
                                            : "0%"
                                }}
                            ></span>
                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                ADD JOB MODAL
            ================================================= */}

            {showAddJob && (

                <div
                    className="add-job-overlay"
                    onClick={() =>
                        !creatingJob &&
                        setShowAddJob(false)
                    }
                >

                    <div
                        className="add-job-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close-button"
                            onClick={() =>
                                !creatingJob &&
                                setShowAddJob(false)
                            }
                        >
                            ×
                        </button>


                        <div className="modal-top-status">

                            <span className="status-light"></span>

                            POSITION DEPLOYMENT

                            <span>
                                READY
                            </span>

                        </div>


                        <div className="add-job-heading">

                            <div className="add-job-icon">
                                +
                            </div>

                            <div>

                                <div className="modal-module">
                                    COMMAND // CREATE
                                </div>

                                <h2>
                                    DEPLOY NEW POSITION
                                </h2>

                                <p>
                                    Create a new recruitment mission for hunters.
                                </p>

                            </div>

                        </div>


                        <form
                            className="add-job-form"
                            onSubmit={createJob}
                        >

                            <div className="form-field">

                                <label>
                                    POSITION TITLE
                                </label>

                                <input
                                    name="title"
                                    value={newJob.title}
                                    onChange={handleJobChange}
                                    placeholder="e.g. Frontend Developer"
                                />

                            </div>


                            <div className="form-field">

                                <label>
                                    DESCRIPTION
                                </label>

                                <textarea
                                    name="description"
                                    value={newJob.description}
                                    onChange={handleJobChange}
                                    placeholder="Describe the role, responsibilities and requirements..."
                                    rows="5"
                                />

                            </div>


                            <div className="form-row">

                                <div className="form-field">

                                    <label>
                                        EXPERIENCE
                                    </label>

                                    <input
                                        name="experience"
                                        type="number"
                                        min="0"
                                        value={newJob.experience}
                                        onChange={handleJobChange}
                                        placeholder="2"
                                    />

                                    <small>
                                        YEARS
                                    </small>

                                </div>


                                <div className="form-field">

                                    <label>
                                        SALARY
                                    </label>

                                    <input
                                        name="salary"
                                        value={newJob.salary}
                                        onChange={handleJobChange}
                                        placeholder="8-12 LPA"
                                    />

                                </div>

                            </div>


                            <div className="form-field">

                                <label>
                                    LOCATION
                                </label>

                                <input
                                    name="location"
                                    value={newJob.location}
                                    onChange={handleJobChange}
                                    placeholder="Hyderabad / Remote"
                                />

                            </div>


                            {jobError && (

                                <div className="job-form-error">
                                    ⚠ {jobError}
                                </div>

                            )}


                            {jobMessage && (

                                <div className="job-form-success">
                                    ✓ {jobMessage}
                                </div>

                            )}


                            <button
                                type="submit"
                                className="deploy-button"
                                disabled={creatingJob}
                            >

                                {creatingJob ? (

                                    <>
                                        <span className="button-spinner"></span>
                                        DEPLOYING POSITION...
                                    </>

                                ) : (

                                    <>
                                        ⚡ DEPLOY POSITION
                                        <span>→</span>
                                    </>

                                )}

                            </button>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                APPLICANTS MODAL
            ================================================= */}

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


                                                <div className="applicant-status">

                                                    <span
                                                        className={
                                                            `status-badge status-${application.status.toLowerCase()}`
                                                        }
                                                    >
                                                        {application.status}
                                                    </span>

                                                </div>


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