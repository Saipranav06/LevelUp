import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        try {

            const response = await api.post("/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            navigate("/dashboard");

        } catch (error) {

            console.log(error.response.data);

        }

    };

    return (
        <div>

            <h1>⚔️ LEVEL UP ⚔️</h1>

            <h2>Hunter Login</h2>

            <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleLogin}>
                ENTER GATE
            </button>

        </div>
    );
}

export default Login;