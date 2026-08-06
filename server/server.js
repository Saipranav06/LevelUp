require("dotenv").config();


const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend Connected Successfully 🚀"
    });
});

app.get("/api/users", async (req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
});

app.post("/api/register", async (req, res) => {

    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
    data: {
        username,
        email,
        password: hashedPassword,
        role
    }
});

res.json(user);

});

app.listen(PORT, () => {
    console.log(`Level Up server running on port ${PORT}`);
});