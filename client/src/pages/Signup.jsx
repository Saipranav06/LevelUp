import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./Signup.css";

function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("HUNTER");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSignup = async (e) => {

        e.preventDefault();

        setError("");

        if (!username || !email || !password || !role) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post("/register", {
                username,
                email,
                password,
                role
            });

            console.log("Registration successful:", response.data);

            // After signup, go to login
            navigate("/login");

        } catch (error) {

            console.error(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Unable to create account."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="signup-page">

            <div className="signup-glow signup-glow-one"></div>
            <div className="signup-glow signup-glow-two"></div>

            <div className="signup-container">

                {/* Branding */}

                <div className="signup-brand">

                    <div className="signup-brand-icon">
                        ⚔️
                    </div>

                    <h1>
                        LEVEL <span>UP</span>
                    </h1>

                    <div className="signup-brand-line"></div>

                    <p>
                        BEGIN YOUR JOURNEY. CHOOSE YOUR PATH.
                    </p>

                </div>


                {/* Signup Card */}

                <div className="signup-card">

                    <div className="signup-header">

                        <div className="signup-status">
                            <span></span>
                            SYSTEM ONLINE
                        </div>

                        <h2>
                            CREATE YOUR ACCOUNT
                        </h2>

                        <p>
                            Choose your role and enter the Level Up system.
                        </p>

                    </div>


                    <form onSubmit={handleSignup}>

                        {/* Username */}

                        <div className="signup-input-group">

                            <label>
                                USERNAME
                            </label>

                            <div className="signup-input-wrapper">

                                <span className="signup-input-icon">
                                    👤
                                </span>

                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="username"
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="signup-input-group">

                            <label>
                                EMAIL
                            </label>

                            <div className="signup-input-wrapper">

                                <span className="signup-input-icon">
                                    ✉
                                </span>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="email"
                                />

                            </div>

                        </div>


                        {/* Password */}

                        <div className="signup-input-group">

                            <label>
                                PASSWORD
                            </label>

                            <div className="signup-input-wrapper">

                                <span className="signup-input-icon">
                                    🔒
                                </span>

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="new-password"
                                />

                                <button
                                    type="button"
                                    className="signup-password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* Role */}

                        <div className="role-section">

                            <label>
                                CHOOSE YOUR ROLE
                            </label>

                            <div className="role-options">

                                <button
                                    type="button"
                                    className={`role-card ${
                                        role === "HUNTER"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setRole("HUNTER");
                                        setError("");
                                    }}
                                >

                                    <div className="role-icon">
                                        ⚔️
                                    </div>

                                    <div className="role-title">
                                        HUNTER
                                    </div>

                                    <div className="role-description">
                                        Find jobs, complete missions
                                        and level up.
                                    </div>

                                </button>


                                <button
                                    type="button"
                                    className={`role-card employer ${
                                        role === "EMPLOYER"
                                            ? "selected"
                                            : ""
                                    }`}
                                    onClick={() => {
                                        setRole("EMPLOYER");
                                        setError("");
                                    }}
                                >

                                    <div className="role-icon">
                                        🏢
                                    </div>

                                    <div className="role-title">
                                        EMPLOYER
                                    </div>

                                    <div className="role-description">
                                        Create jobs and discover
                                        talented hunters.
                                    </div>

                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="signup-error">
                                ⚠ {error}
                            </div>

                        )}


                        {/* Signup button */}

                        <button
                            type="submit"
                            className="signup-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="signup-spinner"></span>
                                    CREATING ACCOUNT...
                                </>

                            ) : (

                                <>
                                    ⚔️ JOIN LEVEL UP
                                </>

                            )}

                        </button>

                    </form>


                    {/* Login */}

                    <div className="signup-login">

                        <span>
                            ALREADY HAVE AN ACCOUNT?
                        </span>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            ENTER THE GATE →
                        </button>

                    </div>

                </div>


                <div className="signup-ranks">

                    <span>E</span>
                    <span>→</span>
                    <span>D</span>
                    <span>→</span>
                    <span>C</span>
                    <span>→</span>
                    <span>B</span>
                    <span>→</span>
                    <span>A</span>
                    <span>→</span>
                    <strong>S</strong>

                </div>

                <p className="signup-copyright">
                    © 2026 LEVEL UP • HUNTER SYSTEM
                </p>

            </div>

        </div>
    );
}

export default Signup;