import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyApplications.css";

function MyApplications() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // FETCH MY APPLICATIONS
    // ==========================

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                setLoading(true);
                setError("");

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

                console.log(
                    "My applications:",
                    response.data
                );

                setApplications(
                    response.data.applications || []
                );

            } catch (error) {

                console.error(
                    "My applications error:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load your applications"
                );

            } finally {

                setLoading(false);

            }

        };

        fetchApplications();

    }, []);


    // ==========================
    // STATUS HELPERS
    // ==========================

    const getStatusClass = (status) => {

        switch (status) {

            case "APPLIED":
                return "status-applied";

            case "SHORTLISTED":
                return "status-shortlisted";

            case "ACCEPTED":
                return "status-accepted";

            case "REJECTED":
                return "status-rejected";

            default:
                return "status-default";

        }

    };


    const getStatusIcon = (status) => {

        switch (status) {

            case "APPLIED":
                return "📨";

            case "SHORTLISTED":
                return "🎯";

            case "ACCEPTED":
                return "✓";

            case "REJECTED":
                return "×";

            default:
                return "📋";

        }

    };


    // ==========================
    // PROGRESS
    // ==========================

    const getProgressState = (status) => {

        if (status === "REJECTED") {
            return 1;
        }

        if (status === "ACCEPTED") {
            return 3;
        }

        if (status === "SHORTLISTED") {
            return 2;
        }

        return 1;

    };


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="applications-page">

                <div className="applications-header">

                    <div className="system-kicker">
                        HUNTER SYSTEM / APPLICATIONS
                    </div>

                    <h1>
                        MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-loading">

                    <div className="application-loader">

                        <div className="loader-ring"></div>

                        <div className="loader-core">
                            <span>LVL</span>
                        </div>

                    </div>

                    <div className="loading-label">
                        SYNCHRONIZING APPLICATION DATA
                    </div>

                    <p>
                        Connecting to Hunter Database...
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

            <div className="applications-page">

                <div className="applications-header">

                    <div className="system-kicker">
                        HUNTER SYSTEM / APPLICATIONS
                    </div>

                    <h1>
                        MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-error">

                    <div className="error-symbol">
                        !
                    </div>

                    <div className="error-kicker">
                        SYSTEM ERROR
                    </div>

                    <h2>
                        APPLICATION DATA UNAVAILABLE
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        className="retry-button"
                        onClick={() =>
                            window.location.reload()
                        }
                    >
                        RECONNECT
                    </button>

                </div>

            </div>

        );

    }


    // ==========================
    // SUMMARY DATA
    // ==========================

    const totalApplications =
        applications.length;

    const appliedCount =
        applications.filter(
            (application) =>
                application.status === "APPLIED"
        ).length;

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

    const rejectedCount =
        applications.filter(
            (application) =>
                application.status === "REJECTED"
        ).length;


    // ==========================
    // EMPTY
    // ==========================

    if (applications.length === 0) {

        return (

            <div className="applications-page">

                <div className="applications-header">

                    <div className="system-kicker">
                        HUNTER SYSTEM / APPLICATIONS
                    </div>

                    <h1>
                        MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-empty">

                    <div className="empty-orb">
                        <span>📭</span>
                    </div>

                    <div className="empty-kicker">
                        NO ACTIVE MISSIONS
                    </div>

                    <h2>
                        APPLICATION QUEUE EMPTY
                    </h2>

                    <p>
                        You have not submitted any job
                        applications yet.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // MAIN APPLICATION PAGE
    // ==========================

    return (

        <div className="applications-page">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="applications-header">

                <div className="system-kicker">
                    HUNTER SYSTEM / APPLICATIONS
                </div>

                <h1>
                    MY APPLICATIONS
                </h1>

                <p>
                    Track your recruitment journey
                </p>

            </div>


            {/* ==========================
                SYSTEM STATUS
            ========================== */}

            <div className="applications-system-bar">

                <div className="system-status-left">

                    <span className="system-status-dot"></span>

                    <span>
                        APPLICATION SYSTEM ONLINE
                    </span>

                </div>

                <span className="system-status-right">
                    {totalApplications} ACTIVE RECORD
                    {totalApplications !== 1 ? "S" : ""}
                </span>

            </div>


            {/* ==========================
                SUMMARY
            ========================== */}

            <div className="applications-summary">

                <div className="summary-card total-card">

                    <div className="summary-card-top">

                        <span className="summary-icon">
                            ◈
                        </span>

                        <span className="summary-index">
                            01
                        </span>

                    </div>

                    <span className="summary-label">
                        TOTAL APPLICATIONS
                    </span>

                    <strong className="summary-value">
                        {totalApplications}
                    </strong>

                </div>


                <div className="summary-card">

                    <div className="summary-card-top">

                        <span className="summary-icon">
                            ◌
                        </span>

                        <span className="summary-index">
                            02
                        </span>

                    </div>

                    <span className="summary-label">
                        SUBMITTED
                    </span>

                    <strong className="summary-value">
                        {appliedCount}
                    </strong>

                </div>


                <div className="summary-card">

                    <div className="summary-card-top">

                        <span className="summary-icon">
                            ◎
                        </span>

                        <span className="summary-index">
                            03
                        </span>

                    </div>

                    <span className="summary-label">
                        SHORTLISTED
                    </span>

                    <strong className="summary-value">
                        {shortlistedCount}
                    </strong>

                </div>


                <div className="summary-card accepted-summary">

                    <div className="summary-card-top">

                        <span className="summary-icon">
                            ✓
                        </span>

                        <span className="summary-index">
                            04
                        </span>

                    </div>

                    <span className="summary-label">
                        ACCEPTED
                    </span>

                    <strong className="summary-value">
                        {acceptedCount}
                    </strong>

                </div>

            </div>


            {/* ==========================
                APPLICATIONS
            ========================== */}

            <div className="applications-section">

                <div className="section-heading">

                    <div>

                        <span className="section-kicker">
                            MISSION LOG
                        </span>

                        <h2>
                            APPLICATION HISTORY
                        </h2>

                    </div>

                    <span className="section-count">
                        {totalApplications
                            .toString()
                            .padStart(2, "0")}
                    </span>

                </div>


                <div className="applications-list">

                    {applications.map(
                        (application, index) => {

                            const job =
                                application.job;

                            const status =
                                application.status;

                            const progress =
                                getProgressState(status);

                            return (

                                <div
                                    className={`application-card ${getStatusClass(status)}`}
                                    key={application.id}
                                    style={{
                                        "--card-delay":
                                            `${index * 0.08}s`
                                    }}
                                >

                                    {/* CARD TOP LINE */}

                                    <div className="card-top-line">

                                        <span>
                                            APPLICATION #
                                            {application.id}
                                        </span>

                                        <span>
                                            {new Date(
                                                application.createdAt
                                            ).toLocaleDateString()}
                                        </span>

                                    </div>


                                    {/* MAIN HEADER */}

                                    <div className="application-card-header">

                                        <div className="application-job">

                                            <div className="application-job-icon">

                                                <div className="job-icon-inner">
                                                    💻
                                                </div>

                                            </div>

                                            <div>

                                                <div className="job-module">
                                                    JOB OPPORTUNITY
                                                </div>

                                                <h2>
                                                    {job?.title ||
                                                        "Unknown Job"}
                                                </h2>

                                                <p>
                                                    <span>
                                                        ◈
                                                    </span>

                                                    {job?.employer
                                                        ?.username ||
                                                        "Company"}
                                                </p>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div
                                            className={`application-status ${getStatusClass(status)}`}
                                        >

                                            <span className="status-icon">
                                                {getStatusIcon(status)}
                                            </span>

                                            <span>
                                                {status}
                                            </span>

                                        </div>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="application-details">

                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                ◉
                                            </span>

                                            <div>

                                                <small>
                                                    LOCATION
                                                </small>

                                                <strong>
                                                    {job?.location ||
                                                        "Not specified"}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                ₹
                                            </span>

                                            <div>

                                                <small>
                                                    COMPENSATION
                                                </small>

                                                <strong>
                                                    {job?.salary ||
                                                        "Not specified"}
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="detail-item">

                                            <span className="detail-icon">
                                                ◈
                                            </span>

                                            <div>

                                                <small>
                                                    EXPERIENCE
                                                </small>

                                                <strong>
                                                    {job?.experience ??
                                                        "N/A"}
                                                    + years
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div className="application-progress">

                                        <div className="progress-header">

                                            <span>
                                                APPLICATION PROTOCOL
                                            </span>

                                            <span>
                                                {status === "REJECTED"
                                                    ? "TERMINATED"
                                                    : `${Math.round(
                                                        (progress / 3) *
                                                        100
                                                    )}% COMPLETE`}
                                            </span>

                                        </div>


                                        <div className="progress-line">

                                            {/* APPLIED */}

                                            <div
                                                className={`progress-node ${
                                                    progress >= 1
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >

                                                <span>
                                                    01
                                                </span>

                                                <small>
                                                    SUBMITTED
                                                </small>

                                            </div>


                                            <div
                                                className={`progress-connector ${
                                                    progress >= 2
                                                        ? "active"
                                                        : ""
                                                }`}
                                            ></div>


                                            {/* SHORTLISTED */}

                                            <div
                                                className={`progress-node ${
                                                    progress >= 2
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >

                                                <span>
                                                    02
                                                </span>

                                                <small>
                                                    SHORTLISTED
                                                </small>

                                            </div>


                                            <div
                                                className={`progress-connector ${
                                                    progress >= 3
                                                        ? "active"
                                                        : ""
                                                }`}
                                            ></div>


                                            {/* ACCEPTED */}

                                            <div
                                                className={`progress-node ${
                                                    progress >= 3
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >

                                                <span>
                                                    03
                                                </span>

                                                <small>
                                                    DECISION
                                                </small>

                                            </div>

                                        </div>


                                        {/* REJECTED STATE */}

                                        {status === "REJECTED" && (

                                            <div className="rejected-message">

                                                <span className="rejected-icon">
                                                    ×
                                                </span>

                                                <div>

                                                    <strong>
                                                        APPLICATION CLOSED
                                                    </strong>

                                                    <p>
                                                        Unfortunately, this
                                                        application was not
                                                        selected for the next
                                                        stage.
                                                    </p>

                                                </div>

                                            </div>

                                        )}

                                    </div>


                                    {/* ACCEPTED MESSAGE */}

                                    {status === "ACCEPTED" && (

                                        <div className="accepted-message">

                                            <div className="accepted-icon">
                                                ✓
                                            </div>

                                            <div>

                                                <strong>
                                                    MISSION SUCCESS
                                                </strong>

                                                <p>
                                                    Your application has been
                                                    accepted.
                                                </p>

                                            </div>

                                            <span className="success-pulse">
                                                ●
                                            </span>

                                        </div>

                                    )}


                                    {/* FOOTER */}

                                    <div className="application-footer">

                                        <span>
                                            LEVEL UP RECRUITMENT SYSTEM
                                        </span>

                                        <span>
                                            STATUS:
                                            {" "}
                                            {status}
                                        </span>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            </div>


            {/* ==========================
                FOOTER
            ========================== */}

            <div className="applications-footer">

                <span className="footer-line"></span>

                <span>
                    HUNTER DATABASE CONNECTED
                </span>

                <span className="footer-line"></span>

            </div>

        </div>

    );

}

export default MyApplications;