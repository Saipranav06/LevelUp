import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("Connecting to System...");

  useEffect(() => {
    fetch("http://localhost:5000/api/health")
      .then((response) => response.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch(() => {
        setMessage("System connection failed");
      });
  }, []);

  return (
    <div>
      <h1>LEVEL UP</h1>
      <h2>System Status</h2>
      <p>{message}</p>
    </div>
  );
}

export default App;