import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post("/login", {
                email,
                password,
            });

            const token = response.data.token;

localStorage.setItem("token", token);

const decoded = jwtDecode(token);

console.log("Logged in role:", decoded.role);

if (decoded.role === "EMPLOYER") {
    navigate("/employer");
} else {
    navigate("/dashboard");
}

        } catch (error) {

            console.log(error.response?.data);

            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="login-page">

            {/* Background effects */}
            <div className="login-glow glow-one"></div>
            <div className="login-glow glow-two"></div>

            <div className="login-container">

                {/* Branding */}
                <div className="login-brand">

                    <div className="brand-icon">
                        ⚔️
                    </div>

                    <h1>
                        LEVEL <span>UP</span>
                    </h1>

                    <div className="brand-line"></div>

                    <p>
                        YOUR JOURNEY. YOUR RANK. YOUR FUTURE.
                    </p>

                </div>


                {/* Login Card */}
                <div className="login-card">

                    <div className="card-header">

                        <div className="system-status">
                            <span className="status-dot"></span>
                            SYSTEM ONLINE
                        </div>

                        <h2>
                            HUNTER'S GATE
                        </h2>

                        <p>
                            Enter your credentials to continue your journey.
                        </p>

                    </div>


                    <form onSubmit={handleLogin}>

                        {/* Email */}
                        <div className="input-group">

                            <label htmlFor="email">
                                EMAIL
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    ✉
                                </span>

                                <input
                                    id="email"
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
                        <div className="input-group">

                            <label htmlFor="password">
                                PASSWORD
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    🔒
                                </span>

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="current-password"
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* Error */}
                        {error && (

                            <div className="login-error">
                                ⚠ {error}
                            </div>

                        )}


                        {/* Login button */}
                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span className="spinner"></span>
                                    ENTERING GATE...
                                </>

                            ) : (

                                <>
                                    ⚔️ ENTER THE GATE
                                </>

                            )}

                        </button>

                    </form>


                    {/* Footer */}
                    <div className="login-footer">

                        <span className="footer-line"></span>

                        <span>
                            HUNTER SYSTEM
                        </span>

                        <span className="footer-line"></span>

                    </div>

                </div>
                <div className="signup-link">

    <span>
        NEW TO LEVEL UP?
    </span>

    <button
        type="button"
        onClick={() => navigate("/signup")}
    >
        CREATE ACCOUNT →
    </button>

</div>


                {/* Rank display */}
                <div className="rank-display">

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

                <p className="copyright">
                    © 2026 LEVEL UP • HUNTER SYSTEM
                </p>

            </div>

        </div>
    );
}

export default Login;