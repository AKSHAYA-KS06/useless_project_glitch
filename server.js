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

// Serve generated 3D Pixar character artifacts
const artifactsPath = path.join(process.env.USERPROFILE || 'C:/Users/AKSHAYA KS', '.gemini/antigravity-ide/brain/9aef91cb-3fde-446c-be0b-8687d20d8de7');
app.use('/artifacts', express.static(artifactsPath));

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
- recognizable public person
- or another visible object.

Your job is to identify the main object, animal, or person shown in the image and provide a clean, humorous ThingVerse profile.

IMPORTANT RULES:

1. Identify the main visible object, animal, or person clearly (e.g., Chair, Laptop, Dog, Flower, or person's name).
2. If the image contains a recognizable public person, identify their actual name and provide authentic factual biographical information in whatIsIt, interestingFacts, and moreInformation, accompanied by a verified Wikipedia/source URL in learnMoreUrl. Do not invent personal information for real people.
3. For objects and animals, provide a creative, humorous ThingVerse personality.
4. Keep the funnyDescription SHORT (1 comedy punchline sentence, e.g., "Chair — Professional butt supporter with a full-time job of holding you up."). Do not generate a long paragraph.
5. Provide 1 to 3 interesting facts in interestingFacts.
6. Provide useful context in moreInformation.
7. Return ONLY valid JSON with no markdown fences.

Return exactly this JSON structure:

{
  "identifiedName": "",
  "isPerson": false,
  "whatIsIt": "",
  "funnyDescription": "",
  "interestingFacts": [
    "",
    ""
  ],
  "moreInformation": "",
  "learnMoreUrl": "https://en.wikipedia.org/wiki/...",
  "category": "",
  "confidence": 95,

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

  "astrology": {
    "zodiac": "",
    "element": "",
    "planet": "",
    "prediction": ""
  }
}
`;

            // ========================================
            // GEMINI REQUEST
            // ========================================

            const response =
                await ai.models.generateContent({

                    model: "gemini-3.6-flash",

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
            `🤖 AI: ${ai ? "Configured" : "Not configured"
            }`
        );

        console.log(
            "======================================"
        );

        console.log("");

    }
);