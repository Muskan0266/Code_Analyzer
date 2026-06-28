const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

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

app.post("/api/explain", async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({
                error: "Code is required",
            });
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

        return res.json({
            result: completion.choices[0].message.content,
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            error: err.message,
        });
    }
});

app.get("/", (req, res) => {
    res.json({
        message: "Server Running Successfully",
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});