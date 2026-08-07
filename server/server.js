require("dotenv").config();

const jwt = require("jsonwebtoken");
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

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
    return res.status(401).json({
        message: "Access denied. No token provided."
    });
}
    jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }
        req.user = user;
        next();
    }
);
}


// ==========================
// Health API
// ==========================
app.get("/api/health", (req, res) => {
    res.json({
        message: "Backend Connected Successfully 🚀"
    });
});


// ==========================
// Get All Users
// ==========================
app.get("/api/users",authenticateToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


// ==========================
// Register API
// ==========================
app.post("/api/register", async (req, res) => {
    try {
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

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }
});


// ==========================
// Login API
// ==========================
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found. Please sign up first."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.json({
            message: "Login Successful",
            token
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            message: err.message
        });

    }

});


// ==========================
// Start Server
// ==========================
app.listen(PORT, () => {
    console.log(`Level Up server running on port ${PORT}`);
});