const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");
const path = require("path");

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());

// ---------- GROQ ----------
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// ---------- PROMPT ----------
function buildPrompt(code) {
    return `
You are a senior software engineer.

Analyze the code and respond in this exact structure:

1. Language:
2. What the code does:
3. Step-by-step explanation:
4. Time Complexity:
5. Space Complexity:
6. Improvements:
7. Optimized Code:

Code:
${code}
`;
}

// ---------- API ----------
app.post("/api/explain", async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: "Code required" });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: buildPrompt(code),
                },
            ],
            model: "llama-3.1-8b-instant",
        });

        res.json({
            result: completion.choices[0].message.content,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// ---------- FRONTEND SERVE ----------
const distPath = path.join(process.cwd(), "../Frontend/dist");

app.use(express.static(distPath));

// ✅ FIXED (NO "*" ERROR)
app.get("/", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// ---------- SERVER ----------
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});