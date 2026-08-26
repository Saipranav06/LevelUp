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
    // STATUS CLASS
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


    // ==========================
    // STATUS ICON
    // ==========================

    const getStatusIcon = (status) => {

        switch (status) {

            case "APPLIED":
                return "📨";

            case "SHORTLISTED":
                return "🟡";

            case "ACCEPTED":
                return "🟢";

            case "REJECTED":
                return "🔴";

            default:
                return "📋";

        }

    };


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="applications-page">

                <div className="applications-header">

                    <h1>
                        📋 MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your applications...
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

                    <h1>
                        📋 MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-error">

                    <h2>
                        🔴 APPLICATION ERROR
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // EMPTY
    // ==========================

    if (applications.length === 0) {

        return (

            <div className="applications-page">

                <div className="applications-header">

                    <h1>
                        📋 MY APPLICATIONS
                    </h1>

                    <p>
                        Track your recruitment journey
                    </p>

                </div>

                <div className="applications-empty">

                    <div className="empty-icon">
                        📭
                    </div>

                    <h2>
                        NO APPLICATIONS YET
                    </h2>

                    <p>
                        You haven't applied to any jobs yet.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // APPLICATIONS PAGE
    // ==========================

    return (

        <div className="applications-page">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="applications-header">

                <h1>
                    📋 MY APPLICATIONS
                </h1>

                <p>
                    Track your recruitment journey
                </p>

            </div>


            {/* ==========================
                SUMMARY
            ========================== */}

            <div className="applications-summary">

                <div className="summary-card">

                    <span className="summary-icon">
                        📋
                    </span>

                    <span className="summary-label">
                        TOTAL
                    </span>

                    <span className="summary-value">
                        {applications.length}
                    </span>

                </div>


                <div className="summary-card">

                    <span className="summary-icon">
                        🟡
                    </span>

                    <span className="summary-label">
                        SHORTLISTED
                    </span>

                    <span className="summary-value">

                        {
                            applications.filter(
                                (application) =>
                                    application.status ===
                                    "SHORTLISTED"
                            ).length
                        }

                    </span>

                </div>


                <div className="summary-card">

                    <span className="summary-icon">
                        🟢
                    </span>

                    <span className="summary-label">
                        ACCEPTED
                    </span>

                    <span className="summary-value">

                        {
                            applications.filter(
                                (application) =>
                                    application.status ===
                                    "ACCEPTED"
                            ).length
                        }

                    </span>

                </div>

            </div>


            {/* ==========================
                APPLICATION LIST
            ========================== */}

            <div className="applications-list">

                {applications.map(
                    (application) => {

                        const job =
                            application.job;

                        const status =
                            application.status;

                        return (

                            <div
                                className="application-card"
                                key={application.id}
                            >

                                {/* ==========================
                                    CARD HEADER
                                ========================== */}

                                <div className="application-card-header">

                                    <div className="application-job">

                                        <div className="application-job-icon">
                                            💻
                                        </div>

                                        <div>

                                            <h2>
                                                {job?.title ||
                                                    "Unknown Job"}
                                            </h2>

                                            <p>
                                                🏢{" "}
                                                {
                                                    job?.employer
                                                        ?.username ||
                                                    "Company"
                                                }
                                            </p>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div
                                        className={
                                            `application-status ${
                                                getStatusClass(status)
                                            }`
                                        }
                                    >

                                        <span>
                                            {getStatusIcon(status)}
                                        </span>

                                        {status}

                                    </div>

                                </div>


                                {/* ==========================
                                    JOB DETAILS
                                ========================== */}

                                <div className="application-details">

                                    <div>
                                        📍{" "}
                                        {job?.location ||
                                            "Not specified"}
                                    </div>

                                    <div>
                                        💰{" "}
                                        {job?.salary ||
                                            "Not specified"}
                                    </div>

                                    <div>
                                        🧠{" "}
                                        {job?.experience ??
                                            "N/A"}
                                        + years
                                    </div>

                                </div>


                                {/* ==========================
                                    APPLICATION PROGRESS
                                ========================== */}

                                <div className="application-progress">

                                    <div className="progress-title">
                                        APPLICATION PROGRESS
                                    </div>

                                    <div className="progress-line">

                                        <div
                                            className={
                                                `progress-step ${
                                                    [
                                                        "APPLIED",
                                                        "SHORTLISTED",
                                                        "ACCEPTED"
                                                    ].includes(status)
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <span>
                                                📨
                                            </span>

                                            <small>
                                                Applied
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                `progress-connector ${
                                                    [
                                                        "SHORTLISTED",
                                                        "ACCEPTED"
                                                    ].includes(status)
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                        ></div>


                                        <div
                                            className={
                                                `progress-step ${
                                                    [
                                                        "SHORTLISTED",
                                                        "ACCEPTED"
                                                    ].includes(status)
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <span>
                                                🟡
                                            </span>

                                            <small>
                                                Shortlisted
                                            </small>

                                        </div>


                                        <div
                                            className={
                                                `progress-connector ${
                                                    status ===
                                                    "ACCEPTED"
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                        ></div>


                                        <div
                                            className={
                                                `progress-step ${
                                                    status ===
                                                    "ACCEPTED"
                                                        ? "active"
                                                        : ""
                                                }`
                                            }
                                        >

                                            <span>
                                                🟢
                                            </span>

                                            <small>
                                                Accepted
                                            </small>

                                        </div>

                                    </div>


                                    {/* REJECTED */}

                                    {status === "REJECTED" && (

                                        <div className="rejected-message">

                                            🔴 Unfortunately,
                                            this application was
                                            rejected.

                                        </div>

                                    )}

                                </div>


                                {/* ==========================
                                    FOOTER
                                ========================== */}

                                <div className="application-footer">

                                    <span>
                                        Application #
                                        {application.id}
                                    </span>

                                    <span>
                                        Applied{" "}
                                        {new Date(
                                            application.createdAt
                                        ).toLocaleDateString()}
                                    </span>

                                </div>

                            </div>

                        );

                    }
                )}

            </div>

        </div>

    );

}

export default MyApplications;