const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("./generated/prisma");

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());

app.get("/api/users", async (req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
});

app.listen(PORT, () => {
    console.log(`Level Up server running on port ${PORT}`);
});