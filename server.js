// ============================================
// THINGVERSE
// AI BACKEND SERVER
// ============================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 3000;

// ============================================
// BASIC CONFIGURATION
// ============================================

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// IMAGE UPLOAD CONFIGURATION
// ============================================

const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 10 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Only JPG, PNG and WEBP images are allowed."
                )
            );
        }
    }
});

// ============================================
// GEMINI AI
// ============================================

let ai = null;

if (process.env.GEMINI_API_KEY) {

    ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    console.log("✅ Gemini AI configured");

} else {

    console.log("⚠️ GEMINI_API_KEY not found.");
    console.log("AI analysis will not work until you add your API key.");

}

// ============================================
// HOME ROUTE
// ============================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/api/health", (req, res) => {

    res.json({
        success: true,
        message: "THINGVERSE backend is running!",
        aiConfigured: Boolean(process.env.GEMINI_API_KEY),
        time: new Date().toISOString()
    });

});

// ============================================
// AI IMAGE ANALYSIS
// ============================================

app.post(
    "/api/analyze",
    upload.single("image"),
    async (req, res) => {

        try {

            // Check image
            if (!req.file) {

                return res.status(400).json({

                    success: false,

                    message: "Please upload or capture an image."

                });

            }

            // Check Gemini
            if (!ai) {

                return res.status(500).json({

                    success: false,

                    message:
                        "Gemini API key is not configured. Please check your .env file."

                });

            }

            console.log(
                "📸 Image received:",
                req.file.originalname
            );

            // Convert image to Base64
            const base64Image =
                req.file.buffer.toString("base64");

            // ========================================
            // AI PROMPT
            // ========================================

            const prompt = `

You are the creative AI engine of a website called THINGVERSE.

THINGVERSE asks:

"What if everything around us had a life?"

The uploaded image contains an ordinary thing.

It could be:

- fruit
- vegetable
- food
- laptop
- phone
- chair
- bottle
- shoe
- book
- bag
- vehicle
- household object
- animal
- gadget
- or another visible object.

Your job is to turn the main visible object into a completely fictional character.

IMPORTANT RULES:

1. Identify the main visible object.
2. Keep everything fictional and humorous.
3. Do not identify real people.
4. Do not make serious claims about the real object.
5. Do not provide dangerous instructions.
6. Keep the content family-friendly.
7. The LinkedIn section is a parody.
8. The Matrimony section is a fictional parody profile for the object.
9. Astrology is fictional entertainment only.
10. Do not use markdown.
11. Return ONLY valid JSON.
12. Make the humor suitable for college students.
13. Make the answers creative enough for a hackathon demonstration.

Return exactly this JSON structure:

{
  "objectName": "",
  "nickname": "",
  "category": "",
  "confidence": 0,
  "oneLineDescription": "",
  "funnyDescription": "",

  "personality": {
    "trait1": "",
    "trait2": "",
    "trait3": ""
  },

  "linkedin": {
    "headline": "",
    "about": "",
    "currentRole": "",
    "skills": [],
    "experience": ""
  },

  "matrimony": {
    "status": "",
    "lookingFor": "",
    "bestMatch": "",
    "bio": "",
    "greenFlags": [],
    "redFlags": []
  },

  "astrology": {
    "zodiac": "",
    "element": "",
    "luckyNumber": "",
    "mood": "",
    "prediction": ""
  },

  "funFacts": [],

  "dailyLife": "",

  "finalVerdict": ""
}

REQUIREMENTS:

objectName:
Identify what is actually visible.

nickname:
Create a funny nickname.

category:
Give a suitable category.

confidence:
Give a number from 0 to 100.

oneLineDescription:
One funny sentence.

funnyDescription:
2-4 funny sentences.

personality:
Exactly 3 traits.

LinkedIn:
Exactly 4 skills.

Matrimony:
Exactly 3 green flags.
Exactly 3 red flags.

Astrology:
Create a completely fictional zodiac identity.

funFacts:
Exactly 4 funny facts.

dailyLife:
Describe a fictional normal day in the object's life.

finalVerdict:
Give a funny final judgement.

Remember:

This is a fictional entertainment experience.

Return JSON only.

`;

            // ========================================
            // GEMINI REQUEST
            // ========================================

            const response =
                await ai.models.generateContent({

                    model: "gemini-2.5-flash",

                    contents: [

                        {
                            inlineData: {

                                mimeType:
                                    req.file.mimetype,

                                data:
                                    base64Image

                            }
                        },

                        {
                            text: prompt
                        }

                    ],

                    config: {

                        responseMimeType:
                            "application/json"

                    }

                });

            // ========================================
            // GET AI RESPONSE
            // ========================================

            let resultText = response.text;

            if (!resultText) {

                throw new Error(
                    "AI returned an empty response."
                );

            }

            console.log(
                "🤖 AI response received"
            );

            // Remove accidental markdown fences
            resultText = resultText
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            // ========================================
            // PARSE JSON
            // ========================================

            let result;

            try {

                result = JSON.parse(resultText);

            } catch (jsonError) {

                console.error(
                    "JSON parsing error:",
                    jsonError
                );

                console.error(
                    "AI response:",
                    resultText
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "The AI returned an invalid response."

                });

            }

            // ========================================
            // SEND RESULT TO FRONTEND
            // ========================================

            res.json({

                success: true,

                result: result

            });

        } catch (error) {

            console.error(
                "❌ Analysis error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message ||
                    "Something went wrong while analyzing the image."

            });

        }

    }
);

// ============================================
// ERROR HANDLER
// ============================================

app.use(
    (error, req, res, next) => {

        console.error(
            "❌ Server error:",
            error.message
        );

        res.status(400).json({

            success: false,

            message: error.message

        });

    }
);

// ============================================
// START SERVER
// ============================================

app.listen(
    PORT,
    () => {

        console.log("");

        console.log(
            "======================================"
        );

        console.log(
            "          THINGVERSE SERVER"
        );

        console.log(
            "======================================"
        );

        console.log(
            `🚀 Server: http://localhost:${PORT}`
        );

        console.log(
            `🤖 AI: ${
                ai ? "Configured" : "Not configured"
            }`
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);