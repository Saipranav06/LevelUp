const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Level Up API is running"
    });
});

app.listen(PORT, () => {
    console.log(`Level Up server running on port ${PORT}`);
});