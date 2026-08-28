require("dotenv").config();

const axios = require("axios");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const upload = require("./multer");
const extractResumeText = require("./extractResume");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");


// ==========================
// Database Setup
// ==========================

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
});


// ==========================
// Express Setup
// ==========================

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==========================
// Authentication Middleware
// ==========================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const token =
        authHeader && authHeader.split(" ")[1];

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

app.get(
    "/api/users",
    authenticateToken,
    async (req, res) => {

        try {

            const users =
                await prisma.user.findMany();

            res.json(users);

        } catch (err) {

            console.error(err);

            res.status(500).json({
                message: "Something went wrong"
            });

        }

    }
);


// ==========================
// Register API
// ==========================

app.post(
    "/api/register",
    async (req, res) => {

        try {

            const {
                username,
                email,
                password,
                role
            } = req.body;

            const hashedPassword =
                await bcrypt.hash(password, 10);

            const user =
                await prisma.user.create({
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

    }
);


// ==========================
// Login API
// ==========================

app.post(
    "/api/login",
    async (req, res) => {

        try {

            const {
                email,
                password
            } = req.body;

            const user =
                await prisma.user.findUnique({
                    where: {
                        email
                    }
                });

            if (!user) {

                return res.status(404).json({
                    message:
                        "User not found. Please sign up first."
                });

            }

            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!isMatch) {

                return res.status(401).json({
                    message: "Invalid password"
                });

            }

            const token =
                jwt.sign(
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

    }
);


// ==========================
// Profile API
// ==========================

app.get(
    "/api/profile",
    authenticateToken,
    async (req, res) => {

        try {

            const profile =
                await prisma.user.findUnique({

                    where: {
                        id: req.user.id
                    },

                    select: {

                        id: true,

                        username: true,

                        email: true,

                        role: true,

                        bio: true,

                        profileImage: true,

                        // ==========================
                        // HUNTER DATA
                        // ==========================

                        hunterScore: true,

                        hunterRank: true,

                        hunterExp: true,

                        hunterLevel: true,

                        skillsCount: true

                    }

                });


            if (!profile) {

                return res.status(404).json({
                    message: "Profile not found"
                });

            }


            res.json({

                user: {

                    id:
                        profile.id,

                    username:
                        profile.username,

                    email:
                        profile.email,

                    role:
                        profile.role,

                    bio:
                        profile.bio,

                    profileImage:
                        profile.profileImage

                },

                hunter: {

                    score:
                        profile.hunterScore,

                    rank:
                        profile.hunterRank,

                    exp:
                        profile.hunterExp,

                    level:
                        profile.hunterLevel,

                    skillsCount:
                        profile.skillsCount

                }

            });

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch profile"

            });

        }

    }
);


// ==========================
// Hunter Stats API
// ==========================

app.get(
    "/api/hunter",
    authenticateToken,
    async (req, res) => {

        try {

            const hunter =
                await prisma.user.findUnique({

                    where: {
                        id: req.user.id
                    },

                    select: {
                        hunterScore: true,
                        hunterRank: true,
                        hunterExp: true,
                        hunterLevel: true,
                        skillsCount: true
                    }

                });


            if (!hunter) {

                return res.status(404).json({
                    message: "Hunter data not found"
                });

            }


            res.json({

                score:
                    hunter.hunterScore,

                rank:
                    hunter.hunterRank,

                exp:
                    hunter.hunterExp,

                level:
                    hunter.hunterLevel,

                skillsCount:
                    hunter.skillsCount

            });

        } catch (error) {

            console.error(
                "Hunter stats error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch hunter stats"
            });

        }

    }
);

// ==========================
// Create Job API
// ==========================

app.post(
    "/api/jobs",
    authenticateToken,

    async (req, res) => {

        try {

            const {
                title,
                description,
                experience,
                salary,
                location,
                skills
            } = req.body;


            // ==========================
            // Validate Required Fields
            // ==========================

            if (
                !title ||
                !description ||
                experience === undefined ||
                !salary ||
                !location ||
                !Array.isArray(skills)
            ) {

                return res.status(400).json({
                    message:
                        "All job fields and skills are required"
                });

            }


            // ==========================
            // Create Job
            // ==========================

            const job =
    await prisma.job.create({

        data: {

            title:
                title,

            description:
                description,

            experience:
                Number(experience),

            salary:
                salary,

            location:
                location,

            employerId:
                req.user.id,

            skills: {
                create: skills.map((skillId) => ({
                    skill: {
                        connect: {
                            id: Number(skillId)
                        }
                    }
                }))
            }

        },

        include: {

            skills: {
                include: {
                    skill: true
                }
            }

        }

    });


            // ==========================
            // Send Response
            // ==========================

            res.status(201).json({

                message:
                    "Job created successfully",

                job:
                    job

            });

        } catch (error) {

            console.error(
                "Create job error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to create job"

            });

        }

    }
);
// ==========================
// Get All Jobs API
// ==========================

app.get(
    "/api/jobs",
    authenticateToken,

    async (req, res) => {

        try {

            const jobs =
                await prisma.job.findMany({

                    include: {

                        employer: {

                            select: {

                                id: true,

                                username: true,

                                email: true

                            }

                        }

                    },

                    orderBy: {

                        createdAt: "desc"

                    }

                });


            res.json({

                jobs:
                    jobs

            });

        } catch (error) {

            console.error(
                "Get jobs error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch jobs"

            });

        }

    }
);

// ==========================
// Get All Skills API
// ==========================

app.get(
    "/api/skills",
    authenticateToken,

    async (req, res) => {

        try {

            const skills =
                await prisma.skill.findMany({

                    orderBy: {
                        name: "asc"
                    }

                });

            res.json({

                skills: skills

            });

        } catch (error) {

            console.error(
                "Get skills error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch skills"

            });

        }

    }
);

// ==========================
// Get Employer's Own Jobs
// ==========================

app.get(
    "/api/employer/jobs",
    authenticateToken,

    async (req, res) => {

        try {

            const jobs =
                await prisma.job.findMany({

                    where: {
                        employerId: req.user.id
                    },

                    include: {

                        employer: {

                            select: {

                                id: true,
                                username: true,
                                email: true

                            }

                        }

                    },

                    orderBy: {

                        createdAt: "desc"

                    }

                });

            res.json({

                jobs: jobs

            });

        } catch (error) {

            console.error(
                "Get employer jobs error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch employer jobs"

            });

        }

    }
);
// ==========================
// Apply To Job API
// ==========================

app.post(
    "/api/jobs/:id/apply",
    authenticateToken,

    async (req, res) => {

        try {

            const jobId =
                Number(req.params.id);

            // ==========================
            // Validate Job ID
            // ==========================

            if (isNaN(jobId)) {

                return res.status(400).json({
                    message:
                        "Invalid job ID"
                });

            }


            // ==========================
            // Check Job Exists
            // ==========================

            const job =
                await prisma.job.findUnique({

                    where: {
                        id: jobId
                    }

                });


            if (!job) {

                return res.status(404).json({
                    message:
                        "Job not found"
                });

            }


            // ==========================
            // Create Application
            // ==========================

            const application =
                await prisma.application.create({

                    data: {

                        applicantId:
                            req.user.id,

                        jobId:
                            jobId,

                        status:
                            "APPLIED"

                    }

                });


            // ==========================
            // Send Response
            // ==========================

            res.status(201).json({

                message:
                    "Application submitted successfully",

                application:
                    application

            });

        } catch (error) {

            console.error(
                "Apply to job error:",
                error
            );


            // ==========================
            // Duplicate Application
            // ==========================

            if (
                error.code === "P2002"
            ) {

                return res.status(409).json({

                    message:
                        "You have already applied to this job"

                });

            }


            res.status(500).json({

                message:
                    "Failed to apply for job"

            });

        }

    }
);

// ==========================
// Get Employer Applications API
// ==========================

app.get(
    "/api/employer/applications",
    authenticateToken,

    async (req, res) => {

        try {

            const applications =
                await prisma.application.findMany({

                    where: {

                        job: {

                            employerId:
                                req.user.id

                        }

                    },

                    include: {

                        applicant: {

                            select: {

                                id: true,

                                username: true,

                                email: true,

                                bio: true,

                                profileImage: true,

                                hunterScore: true,

                                hunterRank: true,

                                hunterExp: true,

                                hunterLevel: true,

                                skillsCount: true,

                                // ==========================
                                // APPLICANT SKILLS
                                // ==========================

                                skills: {

                                    include: {

                                        skill: true

                                    }

                                },

                                resumeAnalysis: true

                            }

                        },

                        job: {

                            select: {

                                id: true,

                                title: true,

                                location: true,

                                salary: true,

                                experience: true,

                                // ==========================
                                // REQUIRED JOB SKILLS
                                // ==========================

                                skills: {

                                    include: {

                                        skill: true

                                    }

                                }

                            }

                        }

                    },

                    orderBy: {

                        createdAt: "desc"

                    }

                });


            // =====================================================
            // CALCULATE MATCH PERCENTAGE
            // =====================================================

            const applicationsWithMatch =
                applications.map((application) => {

                    console.log(
    "========== MATCH DEBUG =========="
);

console.log(
    "Applicant:",
    application.applicant.username
);

console.log(
    "Applicant Skills:",
    application.applicant.skills
);

console.log(
    "Job:",
    application.job.title
);

console.log(
    "Job Skills:",
    application.job.skills
);

console.log(
    "================================="
);

                    // Applicant's Skill IDs

                    const applicantSkillIds =
                        application.applicant.skills.map(
                            (userSkill) =>
                                userSkill.skillId
                        );


                    // Job's Required Skill IDs

                    const requiredSkillIds =
                        application.job.skills.map(
                            (jobSkill) =>
                                jobSkill.skillId
                        );


                    // Find Matching Skills

                    const matchedSkills =
                        requiredSkillIds.filter(
                            (skillId) =>
                                applicantSkillIds.includes(
                                    skillId
                                )
                        );


                    // Calculate Percentage

                    const matchPercentage =
                        requiredSkillIds.length > 0
                            ? Math.round(
                                (
                                    matchedSkills.length /
                                    requiredSkillIds.length
                                ) * 100
                            )
                            : 0;


                    return {

                        ...application,

                        matchPercentage:

                            matchPercentage

                    };

                });


            // =====================================================
            // SEND RESPONSE
            // =====================================================

            res.json({

                applications:
                    applicationsWithMatch

            });


        } catch (error) {

            console.error(
                "Get employer applications error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch employer applications"

            });

        }

    }
);

// ==========================
// Update Application Status API
// ==========================

app.put(
    "/api/applications/:id/status",
    authenticateToken,

    async (req, res) => {

        try {

            const applicationId =
                Number(req.params.id);

            const {
                status
            } = req.body;


            // ==========================
            // Validate Application ID
            // ==========================

            if (isNaN(applicationId)) {

                return res.status(400).json({

                    message:
                        "Invalid application ID"

                });

            }


            // ==========================
            // Validate Status
            // ==========================

            const allowedStatuses = [

                "APPLIED",
                "SHORTLISTED",
                "ACCEPTED",
                "REJECTED"

            ];


            if (
                !allowedStatuses.includes(status)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid application status"

                });

            }


            // ==========================
            // Find Application
            // ==========================

            const application =
                await prisma.application.findUnique({

                    where: {
                        id: applicationId
                    },

                    include: {

                        job: {

                            select: {

                                employerId: true

                            }

                        }

                    }

                });


            if (!application) {

                return res.status(404).json({

                    message:
                        "Application not found"

                });

            }


            // ==========================
            // Check Employer Ownership
            // ==========================

            if (
                application.job.employerId !==
                req.user.id
            ) {

                return res.status(403).json({

                    message:
                        "You are not authorized to update this application"

                });

            }


            // ==========================
            // Update Status
            // ==========================

            const updatedApplication =
                await prisma.application.update({

                    where: {

                        id:
                            applicationId

                    },

                    data: {

                        status:
                            status

                    }

                });


            // ==========================
            // Send Response
            // ==========================

            res.json({

                message:
                    "Application status updated successfully",

                application:
                    updatedApplication

            });

        } catch (error) {

            console.error(
                "Update application status error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to update application status"

            });

        }

    }
);
// ==========================
// Get My Applications API
// ==========================

app.get(
    "/api/my-applications",
    authenticateToken,

    async (req, res) => {

        try {

            const applications =
                await prisma.application.findMany({

                    where: {

                        applicantId:
                            req.user.id

                    },

                    include: {

                        job: {

                            select: {

                                id: true,

                                title: true,

                                description: true,

                                location: true,

                                salary: true,

                                experience: true,

                                employer: {

                                    select: {

                                        id: true,

                                        username: true,

                                        email: true

                                    }

                                }

                            }

                        }

                    },

                    orderBy: {

                        createdAt: "desc"

                    }

                });


            res.json({

                applications:
                    applications

            });

        } catch (error) {

            console.error(
                "Get my applications error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch your applications"

            });

        }

    }
);

// ============================================================
//                    MISSION SYSTEM
// ============================================================


// ============================================================
// GET DAILY MISSIONS
// ============================================================

app.get(
    "/api/missions",
    authenticateToken,

    async (req, res) => {

        try {

            const userId = req.user.id;


            // Get all missions
            const missions =
                await prisma.mission.findMany({

                    orderBy: {
                        id: "asc"
                    }

                });


            // Get current user's mission progress
            const userMissions =
                await prisma.userMission.findMany({

                    where: {
                        userId: userId
                    }

                });


            // Create lookup object
            const progressMap = {};

            userMissions.forEach(
                (userMission) => {

                    progressMap[
                        userMission.missionId
                    ] = userMission;

                }
            );


            // Combine missions with user progress
            const missionsWithProgress =
                missions.map((mission) => {

                    const progress =
                        progressMap[
                            mission.id
                        ];


                    return {

                        id:
                            mission.id,

                        title:
                            mission.title,

                        description:
                            mission.description,

                        rewardExp:
                            mission.rewardExp,

                        type:
                            mission.type,

                        completed:
                            progress
                                ? progress.completed
                                : false,

                        completedAt:
                            progress
                                ? progress.completedAt
                                : null

                    };

                });


            res.json({

                missions:
                    missionsWithProgress

            });

        } catch (error) {

            console.error(
                "Get missions error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch missions"

            });

        }

    }
);

// ==========================
// COMPLETE MISSION API
// ==========================

app.post(
    "/api/missions/:missionId/complete",
    authenticateToken,

    async (req, res) => {

        try {

            const userId = req.user.id;
            const missionId = Number(req.params.missionId);

            if (!missionId) {
                return res.status(400).json({
                    message: "Invalid mission ID"
                });
            }

            // Check mission exists
            const mission = await prisma.mission.findUnique({
                where: {
                    id: missionId
                }
            });

            if (!mission) {
                return res.status(404).json({
                    message: "Mission not found"
                });
            }

            // Check whether user already completed it
            const existing = await prisma.userMission.findUnique({
                where: {
                    userId_missionId: {
                        userId: userId,
                        missionId: missionId
                    }
                }
            });

            if (existing?.completed) {
                return res.status(400).json({
                    message: "Mission already completed"
                });
            }

            // Create/update mission progress
            const userMission = await prisma.userMission.upsert({

                where: {
                    userId_missionId: {
                        userId: userId,
                        missionId: missionId
                    }
                },

                update: {
                    completed: true,
                    completedAt: new Date()
                },

                create: {
                    userId: userId,
                    missionId: missionId,
                    completed: true,
                    completedAt: new Date()
                }

            });

            // Add EXP to hunter
            const hunter = await prisma.user.findUnique({
                where: {
                    id: userId
                },

                select: {
                    hunterExp: true,
                    hunterLevel: true,
                    hunterRank: true
                }
            });

            const newExp =
                hunter.hunterExp + mission.rewardExp;

            // ==========================
            // LEVEL CALCULATION
            // ==========================

            const newLevel =
                Math.floor(newExp / 1000) + 1;

            // ==========================
            // RANK CALCULATION
            // ==========================

            let newRank = "E-RANK";

            if (newLevel >= 20) {
                newRank = "S-RANK";
            } else if (newLevel >= 15) {
                newRank = "A-RANK";
            } else if (newLevel >= 10) {
                newRank = "B-RANK";
            } else if (newLevel >= 5) {
                newRank = "C-RANK";
            } else if (newLevel >= 3) {
                newRank = "D-RANK";
            }

            // Update hunter
            const updatedHunter = await prisma.user.update({

                where: {
                    id: userId
                },

                data: {
                    hunterExp: newExp,
                    hunterLevel: newLevel,
                    hunterRank: newRank,

                    hunterScore: {
                        increment: mission.rewardExp
                    }
                },

                select: {
                    hunterExp: true,
                    hunterLevel: true,
                    hunterRank: true,
                    hunterScore: true
                }

            });

            res.json({

                message: "Mission completed successfully!",

                rewardExp: mission.rewardExp,

                mission: userMission,

                hunter: updatedHunter

            });

        } catch (error) {

            console.error(
                "Complete mission error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to complete mission"

            });

        }

    }
);


// ============================================================
// COMPLETE MISSION
// ============================================================

app.post(
    "/api/missions/:missionId/complete",
    authenticateToken,

    async (req, res) => {

        try {

            const userId =
                req.user.id;

            const missionId =
                Number(
                    req.params.missionId
                );


            // ------------------------------------------------
            // Validate mission ID
            // ------------------------------------------------

            if (
                !missionId ||
                Number.isNaN(missionId)
            ) {

                return res.status(400).json({

                    message:
                        "Invalid mission ID"

                });

            }


            // ------------------------------------------------
            // Find mission
            // ------------------------------------------------

            const mission =
                await prisma.mission.findUnique({

                    where: {
                        id: missionId
                    }

                });


            if (!mission) {

                return res.status(404).json({

                    message:
                        "Mission not found"

                });

            }


            // ------------------------------------------------
            // Check if user already completed it
            // ------------------------------------------------

            const existingMission =
                await prisma.userMission.findUnique({

                    where: {

                        userId_missionId: {

                            userId:
                                userId,

                            missionId:
                                missionId

                        }

                    }

                });


            if (
                existingMission &&
                existingMission.completed
            ) {

                return res.status(400).json({

                    message:
                        "Mission already completed"

                });

            }


            // ------------------------------------------------
            // Get current Hunter information
            // ------------------------------------------------

            const hunter =
                await prisma.user.findUnique({

                    where: {
                        id: userId
                    },

                    select: {

                        hunterExp:
                            true,

                        hunterLevel:
                            true,

                        hunterRank:
                            true,

                        hunterScore:
                            true

                    }

                });


            if (!hunter) {

                return res.status(404).json({

                    message:
                        "Hunter not found"

                });

            }


            // ------------------------------------------------
            // Calculate new EXP
            // ------------------------------------------------

            const earnedExp =
                mission.rewardExp;

            const newTotalExp =
                hunter.hunterExp +
                earnedExp;


            // ------------------------------------------------
            // Calculate level
            // ------------------------------------------------

            const newLevel =
                Math.floor(
                    newTotalExp / 1000
                ) + 1;


            // ------------------------------------------------
            // Calculate Hunter Rank
            // ------------------------------------------------

            let newRank =
                "E-RANK";


            if (newTotalExp >= 10000) {

                newRank =
                    "S-RANK";

            } else if (
                newTotalExp >= 7500
            ) {

                newRank =
                    "A-RANK";

            } else if (
                newTotalExp >= 5000
            ) {

                newRank =
                    "B-RANK";

            } else if (
                newTotalExp >= 3000
            ) {

                newRank =
                    "C-RANK";

            } else if (
                newTotalExp >= 1500
            ) {

                newRank =
                    "D-RANK";

            }


            // ------------------------------------------------
            // Update everything in one transaction
            // ------------------------------------------------

            const result =
                await prisma.$transaction(

                    async (tx) => {


                        // Mark mission completed
                        const userMission =
                            await tx.userMission.upsert({

                                where: {

                                    userId_missionId: {

                                        userId:
                                            userId,

                                        missionId:
                                            missionId

                                    }

                                },

                                update: {

                                    completed:
                                        true,

                                    completedAt:
                                        new Date()

                                },

                                create: {

                                    userId:
                                        userId,

                                    missionId:
                                        missionId,

                                    completed:
                                        true,

                                    completedAt:
                                        new Date()

                                }

                            });


                        // Update Hunter
                        const updatedHunter =
                            await tx.user.update({

                                where: {

                                    id:
                                        userId

                                },

                                data: {

                                    hunterExp:
                                        newTotalExp,

                                    hunterLevel:
                                        newLevel,

                                    hunterRank:
                                        newRank,

                                    hunterScore:
                                        {
                                            increment:
                                                earnedExp
                                        }

                                },

                                select: {

                                    hunterExp:
                                        true,

                                    hunterLevel:
                                        true,

                                    hunterRank:
                                        true,

                                    hunterScore:
                                        true

                                }

                            });


                        return {

                            userMission:
                                userMission,

                            hunter:
                                updatedHunter

                        };

                    }

                );


            // ------------------------------------------------
            // Send response
            // ------------------------------------------------

            res.json({

                message:
                    "Mission completed successfully! 🎯",

                mission: {

                    id:
                        mission.id,

                    title:
                        mission.title,

                    rewardExp:
                        mission.rewardExp

                },

                earnedExp:
                    earnedExp,

                hunter: {

                    exp:
                        result.hunter.hunterExp,

                    level:
                        result.hunter.hunterLevel,

                    rank:
                        result.hunter.hunterRank,

                    score:
                        result.hunter.hunterScore

                }

            });


        } catch (error) {

            console.error(
                "Complete mission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to complete mission"

            });

        }

    }
);

// ==========================
// Resume Upload API
// ==========================

app.post(
    "/api/upload-resume",
    authenticateToken,
    upload.single("resume"),

    async (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({
                    message: "No resume file uploaded"
                });

            }

            console.log(
                "Resume uploaded:",
                req.file.filename
            );

            const extractedText =
                await extractResumeText(
                    req.file.path
                );

            console.log(
                "========== RESUME TEXT =========="
            );

            console.log(extractedText);

            console.log(
                "================================="
            );

            res.json({

                message:
                    "Resume uploaded successfully",

                filename:
                    req.file.filename,

                originalName:
                    req.file.originalname,

                extractedText:
                    extractedText

            });

        } catch (err) {

            console.error(
                "Resume upload error:",
                err
            );

            res.status(500).json({
                message:
                    "Resume upload failed"
            });

        }

    }
);


// ==========================
// Resume Analysis API
// ==========================

app.post(
    "/api/analyze-resume",
    authenticateToken,

    async (req, res) => {

        try {

            const {
                resumeText
            } = req.body;


            // ==========================
            // Check Resume Text
            // ==========================

            if (
                !resumeText ||
                resumeText.trim().length === 0
            ) {

                return res.status(400).json({
                    message:
                        "Resume text is required"
                });

            }


            console.log(
                "========== ANALYZING RESUME =========="
            );

            console.log(resumeText);

            console.log(
                "======================================"
            );


            // ==========================
            // AI Prompt
            // ==========================

            const prompt = `

You are an expert resume analyzer.

Analyze the resume below.

Return ONLY valid JSON.

Do not use markdown.
Do not use code fences.
Do not add explanations outside the JSON.

The JSON must have exactly these fields:

{
    "score": 0,
    "skills": [],
    "strengths": [],
    "weaknesses": [],
    "recommendations": []
}

Rules:

- score must be a number from 0 to 100.
- skills must be an array of strings.
- strengths must be an array of strings.
- weaknesses must be an array of strings.
- recommendations must be an array of strings.
- Keep the analysis specific to the resume.
- Do not invent qualifications that are not present.

Resume:

${resumeText}

`;


            // ==========================
            // OpenRouter Request
            // ==========================

            const aiResponse =
                await axios.post(

                    "https://openrouter.ai/api/v1/chat/completions",

                    {

                        model:
                            "openrouter/free",

                        messages: [

                            {
                                role: "user",
                                content: prompt
                            }

                        ]

                    },

                    {

                        headers: {

                            Authorization:
                                `Bearer ${process.env.OPENROUTER_API_KEY}`,

                            "Content-Type":
                                "application/json",

                            "HTTP-Referer":
                                "http://localhost:5173",

                            "X-Title":
                                "Level Up Resume Analyzer"

                        }

                    }

                );


            // ==========================
            // Get AI Response
            // ==========================

            const aiText =
                aiResponse.data
                    .choices[0]
                    .message
                    .content;


            console.log(
                "========== AI RESPONSE =========="
            );

            console.log(aiText);

            console.log(
                "================================="
            );


            // ==========================
            // Convert AI JSON
            // ==========================

            let analysis;

            try {

                analysis =
                    JSON.parse(aiText);

            } catch (error) {

                console.error(
                    "AI returned invalid JSON:",
                    aiText
                );

                return res.status(500).json({

                    message:
                        "AI returned an invalid response"

                });

            }

            // ==========================
// Save Applicant Skills
// ==========================

if (Array.isArray(analysis.skills)) {

    for (const skillName of analysis.skills) {

        const cleanSkillName =
            String(skillName).trim();

        if (!cleanSkillName) {
            continue;
        }

        // Find skill in Skill table
        const skill =
            await prisma.skill.findFirst({
                where: {
                    name: {
                        equals: cleanSkillName,
                        mode: "insensitive"
                    }
                }
            });

        // Only create UserSkill if skill exists
        if (skill) {

            await prisma.userSkill.upsert({

                where: {
                    userId_skillId: {
                        userId: req.user.id,
                        skillId: skill.id
                    }
                },

                update: {},

                create: {
                    userId: req.user.id,
                    skillId: skill.id
                }

            });

        } else {

            console.log(
                "Skill not found in Skill table:",
                cleanSkillName
            );

        }

    }

}


            // ==========================
            // Calculate Hunter Rank
            // ==========================

            const score =
                Number(analysis.score) || 0;


            let hunterRank;

            if (score >= 90) {

                hunterRank = "S-RANK";

            } else if (score >= 80) {

                hunterRank = "A-RANK";

            } else if (score >= 70) {

                hunterRank = "B-RANK";

            } else if (score >= 60) {

                hunterRank = "C-RANK";

            } else if (score >= 50) {

                hunterRank = "D-RANK";

            } else {

                hunterRank = "E-RANK";

            }


            // ==========================
            // Count Skills
            // ==========================

            const skillsCount =
                Array.isArray(analysis.skills)
                    ? analysis.skills.length
                    : 0;


            // ==========================
            // Get Current Hunter Data
            // ==========================

            const currentHunter =
                await prisma.user.findUnique({

                    where: {
                        id: req.user.id
                    },

                    select: {
                        hunterExp: true,
                        hunterLevel: true
                    }

                });


            if (!currentHunter) {

                return res.status(404).json({
                    message: "Hunter data not found"
                });

            }


            // ==========================
            // Previous Hunter Level
            // ==========================

            const previousHunterLevel =
                currentHunter.hunterLevel || 1;


            // ==========================
            // Calculate New EXP
            // ==========================

            const earnedExp =
                score * 10;


            const newHunterExp =
                currentHunter.hunterExp +
                earnedExp;


            // ==========================
            // Calculate New Hunter Level
            // ==========================

            const hunterLevel =
                Math.floor(
                    newHunterExp / 1000
                ) + 1;


            // ==========================
            // LEVEL UP DETECTION
            // ==========================

            const didLevelUp =
                hunterLevel >
                previousHunterLevel;


            const levelUpCount =
                Math.max(
                    0,
                    hunterLevel -
                    previousHunterLevel
                );


            // ==========================
            // Level Up Message
            // ==========================

            let levelUpMessage = null;


            if (didLevelUp) {

                levelUpMessage =
                    levelUpCount === 1
                        ? `⚡ LEVEL UP! You reached Level ${hunterLevel}!`
                        : `⚡ LEVEL UP! You advanced ${levelUpCount} levels and reached Level ${hunterLevel}!`;

            }


            // ==========================
            // Save Analysis + Progress
            // ==========================

            await prisma.user.update({

                where: {
                    id: req.user.id
                },

                data: {

                    hunterScore:
                        score,

                    hunterRank:
                        hunterRank,

                    hunterExp:
                        newHunterExp,

                    hunterLevel:
                        hunterLevel,

                    skillsCount:
                        skillsCount,

                    resumeAnalysis:
                        analysis

                }

            });


            // ==========================
            // Hunter Progress Log
            // ==========================

            if (didLevelUp) {

                console.log(
                    "====================================="
                );

                console.log(
                    "🎉🎉🎉 HUNTER LEVEL UP DETECTED 🎉🎉🎉"
                );

                console.log({

                    userId:
                        req.user.id,

                    previousLevel:
                        previousHunterLevel,

                    newLevel:
                        hunterLevel,

                    levelUpCount:
                        levelUpCount,

                    earnedExp:
                        earnedExp,

                    totalExp:
                        newHunterExp

                });

                console.log(
                    levelUpMessage
                );

                console.log(
                    "====================================="
                );

            } else {

                console.log(
                    "========== HUNTER PROGRESS =========="
                );

                console.log({

                    userId:
                        req.user.id,

                    previousLevel:
                        previousHunterLevel,

                    currentLevel:
                        hunterLevel,

                    earnedExp:
                        earnedExp,

                    totalExp:
                        newHunterExp

                });

                console.log(
                    "====================================="
                );

            }


            // ==========================
            // Send Analysis To Frontend
            // ==========================

            res.json({

                message:
                    "Resume analyzed successfully",

                analysis:
                    analysis,

                hunter: {

                    score:
                        score,

                    rank:
                        hunterRank,

                    exp:
                        newHunterExp,

                    earnedExp:
                        earnedExp,

                    level:
                        hunterLevel,

                    previousLevel:
                        previousHunterLevel,

                    skillsCount:
                        skillsCount,

                    // ==========================
                    // LEVEL UP DATA
                    // ==========================

                    didLevelUp:
                        didLevelUp,

                    levelUpCount:
                        levelUpCount,

                    levelUpMessage:
                        levelUpMessage

                }

            });

        } catch (error) {

            console.error(
                "Resume analysis error:",
                error.response?.data ||
                error.message
            );

            res.status(500).json({

                message:
                    "Failed to analyze resume"

            });

        }

    }
);

// ==========================================================
// HUNTER DAILY MISSIONS
// ==========================================================


// ==========================
// GET MISSIONS
// ==========================

app.get(
    "/api/missions",
    authenticateToken,

    async (req, res) => {

        try {

            const missions =
                await prisma.mission.findMany({

                    orderBy: {
                        id: "asc"
                    }

                });


            // Get user's progress
            const userMissions =
                await prisma.userMission.findMany({

                    where: {
                        userId: req.user.id
                    }

                });


            const progressMap =
                {};

            userMissions.forEach(
                (item) => {

                    progressMap[
                        item.missionId
                    ] = item;

                }
            );


            const missionsWithProgress =
                missions.map(
                    (mission) => {

                        const progress =
                            progressMap[
                                mission.id
                            ];


                        return {

                            id:
                                mission.id,

                            title:
                                mission.title,

                            description:
                                mission.description,

                            rewardExp:
                                mission.rewardExp,

                            type:
                                mission.type,

                            completed:
                                progress
                                    ? progress.completed
                                    : false,

                            completedAt:
                                progress
                                    ? progress.completedAt
                                    : null

                        };

                    }
                );


            res.json({

                missions:
                    missionsWithProgress

            });

        } catch (error) {

            console.error(
                "Get missions error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch missions"

            });

        }

    }
);


// ==========================
// COMPLETE MISSION
// ==========================

app.post(
    "/api/missions/:id/complete",
    authenticateToken,

    async (req, res) => {

        try {

            const missionId =
                Number(req.params.id);


            if (isNaN(missionId)) {

                return res.status(400).json({

                    message:
                        "Invalid mission ID"

                });

            }


            // ==========================
            // FIND MISSION
            // ==========================

            const mission =
                await prisma.mission.findUnique({

                    where: {
                        id: missionId
                    }

                });


            if (!mission) {

                return res.status(404).json({

                    message:
                        "Mission not found"

                });

            }


            // ==========================
            // CHECK EXISTING PROGRESS
            // ==========================

            const existing =
                await prisma.userMission.findUnique({

                    where: {

                        userId_missionId: {

                            userId:
                                req.user.id,

                            missionId:
                                missionId

                        }

                    }

                });


            if (
                existing &&
                existing.completed
            ) {

                return res.status(400).json({

                    message:
                        "Mission already completed"

                });

            }


            // ==========================
            // COMPLETE MISSION
            // ==========================

            const userMission =
                await prisma.userMission.upsert({

                    where: {

                        userId_missionId: {

                            userId:
                                req.user.id,

                            missionId:
                                missionId

                        }

                    },

                    update: {

                        completed:
                            true,

                        completedAt:
                            new Date()

                    },

                    create: {

                        userId:
                            req.user.id,

                        missionId:
                            missionId,

                        completed:
                            true,

                        completedAt:
                            new Date()

                    }

                });


            // ==========================
            // GET CURRENT HUNTER
            // ==========================

            const hunter =
                await prisma.user.findUnique({

                    where: {

                        id:
                            req.user.id

                    },

                    select: {

                        hunterExp:
                            true,

                        hunterLevel:
                            true,

                        hunterScore:
                            true,

                        hunterRank:
                            true

                    }

                });


            if (!hunter) {

                return res.status(404).json({

                    message:
                        "Hunter not found"

                });

            }


            // ==========================
            // ADD EXP
            // ==========================

            const newExp =
                hunter.hunterExp +
                mission.rewardExp;


            // ==========================
            // LEVEL SYSTEM
            // ==========================

            const expPerLevel =
                1000;


            const newLevel =
                Math.floor(
                    newExp /
                    expPerLevel
                ) + 1;


            // ==========================
            // UPDATE HUNTER
            // ==========================

            const updatedHunter =
                await prisma.user.update({

                    where: {

                        id:
                            req.user.id

                    },

                    data: {

                        hunterExp:
                            newExp,

                        hunterLevel:
                            newLevel,

                        hunterScore:
                            hunter.hunterScore +
                            mission.rewardExp

                    },

                    select: {

                        hunterExp:
                            true,

                        hunterLevel:
                            true,

                        hunterScore:
                            true,

                        hunterRank:
                            true

                    }

                });


            // ==========================
            // RESPONSE
            // ==========================

            res.json({

                message:
                    "Mission completed successfully! ⚔️",

                mission: {

                    id:
                        mission.id,

                    title:
                        mission.title,

                    rewardExp:
                        mission.rewardExp

                },

                progress:
                    userMission,

                hunter:
                    updatedHunter

            });

        } catch (error) {

            console.error(
                "Complete mission error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to complete mission"

            });

        }

    }
);


// ==========================================================
// GET USER MISSION PROGRESS
// ==========================================================

app.get(
    "/api/missions/progress",
    authenticateToken,

    async (req, res) => {

        try {

            const progress =
                await prisma.userMission.findMany({

                    where: {

                        userId:
                            req.user.id

                    },

                    include: {

                        mission:
                            true

                    },

                    orderBy: {

                        completedAt:
                            "desc"

                    }

                });


            res.json({

                progress:
                    progress

            });

        } catch (error) {

            console.error(
                "Mission progress error:",
                error
            );


            res.status(500).json({

                message:
                    "Failed to fetch mission progress"

            });

        }

    }
);

// ============================================================
// DAILY MISSIONS
// ============================================================

// GET ALL MISSIONS FOR LOGGED-IN HUNTER
app.get(
    "/api/missions",
    authenticateToken,

    async (req, res) => {

        try {

            const missions =
                await prisma.mission.findMany({

                    include: {

                        userMissions: {

                            where: {
                                userId: req.user.id
                            }

                        }

                    },

                    orderBy: {
                        id: "asc"
                    }

                });


            const formattedMissions =
                missions.map((mission) => {

                    const progress =
                        mission.userMissions[0];

                    return {

                        id: mission.id,

                        title:
                            mission.title,

                        description:
                            mission.description,

                        rewardExp:
                            mission.rewardExp,

                        type:
                            mission.type,

                        completed:
                            progress
                                ? progress.completed
                                : false,

                        completedAt:
                            progress
                                ? progress.completedAt
                                : null

                    };

                });


            res.json({

                missions:
                    formattedMissions

            });

        } catch (error) {

            console.error(
                "Get missions error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch missions"

            });

        }

    }
);


// ============================================================
// COMPLETE MISSION
// ============================================================

app.post(
    "/api/missions/:missionId/complete",
    authenticateToken,

    async (req, res) => {

        try {

            const missionId =
                Number(req.params.missionId);


            // ------------------------------------------------
            // CHECK MISSION EXISTS
            // ------------------------------------------------

            const mission =
                await prisma.mission.findUnique({

                    where: {
                        id: missionId
                    }

                });


            if (!mission) {

                return res.status(404).json({

                    message:
                        "Mission not found"

                });

            }


            // ------------------------------------------------
            // CHECK IF ALREADY COMPLETED
            // ------------------------------------------------

            const existingProgress =
                await prisma.userMission.findUnique({

                    where: {

                        userId_missionId: {

                            userId:
                                req.user.id,

                            missionId:
                                missionId

                        }

                    }

                });


            if (
                existingProgress &&
                existingProgress.completed
            ) {

                return res.status(400).json({

                    message:
                        "Mission already completed"

                });

            }


            // ------------------------------------------------
            // GET CURRENT HUNTER
            // ------------------------------------------------

            const hunter =
                await prisma.user.findUnique({

                    where: {
                        id: req.user.id
                    },

                    select: {

                        hunterExp: true,

                        hunterLevel: true,

                        hunterScore: true,

                        hunterRank: true

                    }

                });


            if (!hunter) {

                return res.status(404).json({

                    message:
                        "Hunter not found"

                });

            }


            // ------------------------------------------------
            // CALCULATE NEW EXP
            // ------------------------------------------------

            const earnedExp =
                mission.rewardExp;


            const newTotalExp =
                hunter.hunterExp +
                earnedExp;


            const newLevel =
                Math.floor(
                    newTotalExp / 1000
                ) + 1;


            // ------------------------------------------------
            // CALCULATE RANK
            // ------------------------------------------------

            let newRank = "E-RANK";


            if (newLevel >= 50) {

                newRank = "S-RANK";

            } else if (newLevel >= 35) {

                newRank = "A-RANK";

            } else if (newLevel >= 25) {

                newRank = "B-RANK";

            } else if (newLevel >= 15) {

                newRank = "C-RANK";

            } else if (newLevel >= 5) {

                newRank = "D-RANK";

            }


            // ------------------------------------------------
            // DATABASE TRANSACTION
            // ------------------------------------------------

            const result =
                await prisma.$transaction(
                    async (tx) => {

                        // Complete mission
                        const userMission =
                            await tx.userMission.upsert({

                                where: {

                                    userId_missionId: {

                                        userId:
                                            req.user.id,

                                        missionId:
                                            missionId

                                    }

                                },

                                update: {

                                    completed:
                                        true,

                                    completedAt:
                                        new Date()

                                },

                                create: {

                                    userId:
                                        req.user.id,

                                    missionId:
                                        missionId,

                                    completed:
                                        true,

                                    completedAt:
                                        new Date()

                                }

                            });


                        // Update hunter
                        const updatedHunter =
                            await tx.user.update({

                                where: {

                                    id:
                                        req.user.id

                                },

                                data: {

                                    hunterExp:
                                        newTotalExp,

                                    hunterLevel:
                                        newLevel,

                                    hunterRank:
                                        newRank

                                },

                                select: {

                                    hunterExp: true,

                                    hunterLevel: true,

                                    hunterRank: true,

                                    hunterScore: true

                                }

                            });


                        return {

                            userMission,

                            updatedHunter

                        };

                    }
                );


            // ------------------------------------------------
            // RESPONSE
            // ------------------------------------------------

            res.json({

                message:
                    "Mission completed successfully! ⚔️",

                earnedExp:
                    earnedExp,

                hunter: {

                    exp:
                        result.updatedHunter.hunterExp,

                    level:
                        result.updatedHunter.hunterLevel,

                    rank:
                        result.updatedHunter.hunterRank,

                    score:
                        result.updatedHunter.hunterScore

                }

            });

        } catch (error) {

            console.error(
                "Complete mission error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to complete mission"

            });

        }

    }
);

// ==========================
// DAILY MISSION SETUP
// ==========================

async function setupDailyMissions() {

    try {

        const missionCount = await prisma.mission.count();

        // Create default missions if none exist
        if (missionCount === 0) {

            await prisma.mission.createMany({

                data: [

                    {
                        title: "Complete Resume Analysis",
                        description: "Analyze your resume using the AI Resume Analyzer.",
                        rewardExp: 50,
                        type: "DAILY"
                    },

                    {
                        title: "Apply To 2 Jobs",
                        description: "Find and apply to at least two suitable jobs.",
                        rewardExp: 75,
                        type: "DAILY"
                    },

                    {
                        title: "Add A New Skill",
                        description: "Add a new skill to your Hunter profile.",
                        rewardExp: 40,
                        type: "DAILY"
                    },

                    {
                        title: "Complete AI Analysis",
                        description: "Run your resume through the AI analysis system.",
                        rewardExp: 100,
                        type: "DAILY"
                    },

                    {
                        title: "Improve Your Profile",
                        description: "Update your Hunter profile with useful information.",
                        rewardExp: 50,
                        type: "DAILY"
                    }

                ]

            });

            console.log(
                "✅ Default daily missions created"
            );

        } else {

            console.log(
                "✅ Daily missions already exist"
            );

        }

    } catch (error) {

        console.error(
            "❌ Daily mission setup error:",
            error
        );

    }

}

setupDailyMissions();

// ==========================
// Start Server
// ==========================

app.listen(
    PORT,
    () => {

        console.log(
            `Level Up server running on port ${PORT}`
        );

    }
);