import { useState } from "react";
import api from "../services/api";
import "./Resume.css";

function Resume() {

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFileChange = (event) => {

        const selectedFile = event.target.files[0];

        if (selectedFile) {
            setFile(selectedFile);
            setMessage("");
        }
    };


    const handleUpload = async () => {

        if (!file) {
            return;
        }

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
            response.data.extractedText);

            localStorage.setItem(
            "resumeFileName",
            response.data.originalName);

            setMessage("🟢 RESUME UPLOADED SUCCESSFULLY");
        } catch (error) {

            console.error(error);

            setMessage(
                error.response?.data?.message ||
                "🔴 RESUME UPLOAD FAILED"
            );

        } finally {

            setUploading(false);

        }
    };


    return (
        <div className="resume-page">

            <h1 className="resume-title">
                ⚔️ RESUME GATE ⚔️
            </h1>

            <p className="resume-subtitle">
                HUNTER RESUME SYSTEM
            </p>


            <div className="resume-card">

                <h2>
                    UPLOAD YOUR RESUME
                </h2>

                <p className="resume-description">
                    Submit your resume to begin your Hunter analysis.
                </p>


                <label className="upload-area">

                    <span className="upload-icon">
                        📄
                    </span>

                    <span className="upload-text">
                        {file
                            ? file.name
                            : "SELECT YOUR RESUME"}
                    </span>

                    <span className="upload-hint">
                        PDF, DOC or DOCX
                    </span>

                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                    />

                </label>


                {file && (
                    <div className="file-status">
                        🟢 FILE READY
                    </div>
                )}


                <button
                    className="upload-button"
                    disabled={!file || uploading}
                    onClick={handleUpload}
                >
                    {uploading
                        ? "⏳ UPLOADING..."
                        : "⚡ UPLOAD RESUME"}
                </button>


                {message && (
                    <div className="file-status">
                        {message}
                    </div>
                )}

            </div>

        </div>
    );
}

export default Resume;