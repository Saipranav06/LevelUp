import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Resume.css";

function Resume() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [message, setMessage] = useState("");
    const [uploaded, setUploaded] = useState(false);

    const validateFile = (selectedFile) => {
        if (!selectedFile) return false;

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const allowedExtensions = [".pdf", ".doc", ".docx"];

        const extension = selectedFile.name
            .substring(selectedFile.name.lastIndexOf("."))
            .toLowerCase();

        if (
            !allowedTypes.includes(selectedFile.type) &&
            !allowedExtensions.includes(extension)
        ) {
            setMessage("INVALID FILE FORMAT");
            return false;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setMessage("FILE SIZE EXCEEDS 10MB");
            return false;
        }

        return true;
    };

    const selectFile = (selectedFile) => {
        if (!validateFile(selectedFile)) {
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setMessage("");
        setUploaded(false);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        selectFile(selectedFile);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setDragActive(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragActive(false);

        const droppedFile = event.dataTransfer.files[0];
        selectFile(droppedFile);
    };

    const handleUpload = async () => {
        if (!file || uploading) return;

        try {
            setUploading(true);
            setMessage("");

            const formData = new FormData();
            formData.append("resume", file);

            const token = localStorage.getItem("token");

            const response = await api.post(
                "/upload-resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data);

            localStorage.setItem(
                "resumeText",
                response.data.extractedText
            );

            localStorage.setItem(
                "resumeFileName",
                response.data.originalName
            );

            setUploaded(true);
            setMessage("RESUME UPLOADED SUCCESSFULLY");

        } catch (error) {
            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "RESUME UPLOAD FAILED"
            );

        } finally {
            setUploading(false);
        }
    };

    const openFilePicker = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="resume-page">

            {/* =========================
                TOP NAVIGATION
            ========================= */}

            <div className="resume-topbar">

                <button
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <span>←</span>
                    BACK TO DASHBOARD
                </button>

                <div className="system-status-box">
                    <span className="system-status-label">
                        SYSTEM STATUS
                    </span>

                    <span className="online-status">
                        <span className="online-dot"></span>
                        ONLINE
                    </span>
                </div>

            </div>


            {/* =========================
                HEADER
            ========================= */}

            <header className="resume-header">

                <h1 className="resume-title">
                    RESUME GATE
                </h1>

                <div className="title-line">
                    <span></span>
                    <b>HUNTER RESUME SYSTEM</b>
                    <span></span>
                </div>

            </header>


            {/* =========================
                MAIN GRID
            ========================= */}

            <main className="resume-main">


                {/* =========================
                    LEFT ANALYSIS PREVIEW
                ========================= */}

                <section className="side-panel analysis-panel">

                    <h3>
                        ANALYSIS PREVIEW
                    </h3>

                    <div className="scanner">

                        <div className="scanner-ring ring-one"></div>
                        <div className="scanner-ring ring-two"></div>
                        <div className="scanner-ring ring-three"></div>

                        <div className="scanner-core">
                            <span className="document-shape">
                                CV
                            </span>
                        </div>

                    </div>


                    <div className="analysis-list">

                        <div className="analysis-item">
                            <span className="analysis-symbol">01</span>
                            <span>FORMAT CHECK</span>
                            <strong>
                                {uploaded ? "✓" : "--"}
                            </strong>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-symbol">02</span>
                            <span>SKILLS MATCHING</span>
                            <strong>
                                {uploaded ? "✓" : "--"}
                            </strong>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-symbol">03</span>
                            <span>EXPERIENCE SCAN</span>
                            <strong>
                                {uploaded ? "✓" : "--"}
                            </strong>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-symbol">04</span>
                            <span>ATS COMPATIBILITY</span>
                            <strong>
                                {uploaded ? "✓" : "--"}
                            </strong>
                        </div>

                        <div className="analysis-item">
                            <span className="analysis-symbol">05</span>
                            <span>OVERALL SCORE</span>
                            <strong>
                                {uploaded ? "READY" : "--"}
                            </strong>
                        </div>

                    </div>


                    <div className="preview-message">
                        {uploaded
                            ? "Resume data successfully uploaded. Your Hunter profile is ready for analysis."
                            : "Upload your resume to activate the AI analysis preview."
                        }
                    </div>

                </section>


                {/* =========================
                    CENTER UPLOAD TERMINAL
                ========================= */}

                <section className="upload-terminal">

                    <div className="terminal-step">
                        STEP 01
                    </div>

                    <h2>
                        UPLOAD YOUR RESUME
                    </h2>

                    <p className="terminal-description">
                        Submit your resume to begin your Hunter analysis.
                    </p>


                    <div
                        className={`drop-zone ${
                            dragActive ? "drag-active" : ""
                        } ${
                            file ? "file-selected" : ""
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={openFilePicker}
                    >

                        <div className="upload-orbit">

                            <div className="upload-ring"></div>

                            <div className="upload-symbol">
                                ↑
                            </div>

                        </div>


                        {file ? (
                            <>
                                <div className="selected-file">
                                    {file.name}
                                </div>

                                <div className="file-details">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                    <span>•</span>
                                    READY FOR ANALYSIS
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="drop-title">
                                    DRAG & DROP YOUR FILE HERE
                                </div>

                                <div className="drop-or">
                                    OR
                                </div>

                                <button
                                    type="button"
                                    className="select-file-button"
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        openFilePicker();
                                    }}
                                >
                                    SELECT FILE
                                </button>

                                <div className="file-details">
                                    PDF, DOC OR DOCX
                                    <span>•</span>
                                    MAX 10MB
                                </div>
                            </>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                        />

                    </div>


                    <button
                        className={`analyze-button ${
                            uploading ? "scanning" : ""
                        }`}
                        disabled={!file || uploading}
                        onClick={handleUpload}
                    >

                        <span className="button-energy">
                            {uploading ? "◌" : "↯"}
                        </span>

                        {uploading
                            ? "ANALYZING RESUME..."
                            : "UPLOAD & ANALYZE"
                        }

                    </button>


                    {message && (
                        <div
                            className={`upload-message ${
                                uploaded ? "success" : "error"
                            }`}
                        >
                            <span></span>
                            {message}
                        </div>
                    )}

                </section>


                {/* =========================
                    RIGHT AI PANEL
                ========================= */}

                <section className="side-panel ai-panel">

                    <h3>
                        AI ANALYSIS WILL CHECK
                    </h3>

                    <div className="ai-check-list">

                        <div className="ai-check">
                            <span>01</span>
                            <b>SKILLS & TECHNOLOGIES</b>
                        </div>

                        <div className="ai-check">
                            <span>02</span>
                            <b>EXPERIENCE RELEVANCE</b>
                        </div>

                        <div className="ai-check">
                            <span>03</span>
                            <b>PROJECT QUALITY</b>
                        </div>

                        <div className="ai-check">
                            <span>04</span>
                            <b>ATS COMPATIBILITY</b>
                        </div>

                        <div className="ai-check">
                            <span>05</span>
                            <b>KEYWORD MATCHING</b>
                        </div>

                        <div className="ai-check">
                            <span>06</span>
                            <b>STRENGTHS & WEAKNESSES</b>
                        </div>

                        <div className="ai-check">
                            <span>07</span>
                            <b>IMPROVEMENT SUGGESTIONS</b>
                        </div>

                    </div>

                </section>

            </main>


            {/* =========================
                SUPPORTED FORMATS
            ========================= */}

            <section className="formats-section">

                <h3>
                    SUPPORTED FORMATS
                </h3>

                <div className="format-grid">

                    <div className="format-card">
                        <div className="format-icon">
                            PDF
                        </div>
                        <span>PDF</span>
                    </div>

                    <div className="format-card">
                        <div className="format-icon">
                            DOC
                        </div>
                        <span>DOC</span>
                    </div>

                    <div className="format-card">
                        <div className="format-icon">
                            DOCX
                        </div>
                        <span>DOCX</span>
                    </div>

                </div>

                <p>
                    MAX FILE SIZE: 10MB
                </p>

            </section>


            {/* =========================
                ANALYSIS PROCESS
            ========================= */}

            <section className="process-section">

                <h3>
                    OUR HUNTER ANALYSIS PROCESS
                </h3>

                <div className="process-track">

                    <div className={`process-step ${
                        file ? "active" : ""
                    }`}>
                        <div className="process-circle">
                            01
                        </div>

                        <div>
                            <b>UPLOAD</b>
                            <span>Upload your resume</span>
                        </div>
                    </div>


                    <div className="process-arrow">
                        →
                    </div>


                    <div className={`process-step ${
                        uploading || uploaded ? "active" : ""
                    }`}>
                        <div className="process-circle">
                            02
                        </div>

                        <div>
                            <b>EXTRACT</b>
                            <span>Extract important data</span>
                        </div>
                    </div>


                    <div className="process-arrow">
                        →
                    </div>


                    <div className={`process-step ${
                        uploading || uploaded ? "active" : ""
                    }`}>
                        <div className="process-circle">
                            03
                        </div>

                        <div>
                            <b>ANALYZE</b>
                            <span>AI analyzes your profile</span>
                        </div>
                    </div>


                    <div className="process-arrow">
                        →
                    </div>


                    <div className={`process-step ${
                        uploaded ? "active" : ""
                    }`}>
                        <div className="process-circle">
                            04
                        </div>

                        <div>
                            <b>SCORE</b>
                            <span>Generate match score</span>
                        </div>
                    </div>


                    <div className="process-arrow">
                        →
                    </div>


                    <div className="process-step">
                        <div className="process-circle">
                            05
                        </div>

                        <div>
                            <b>IMPROVE</b>
                            <span>Get improvement tips</span>
                        </div>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Resume;