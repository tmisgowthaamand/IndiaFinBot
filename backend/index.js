import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenRouter } from "@openrouter/sdk";

// Load environment variables 
dotenv.config();

const app = express();

// CORS configuration - allow requests from Vercel frontend
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'https://india-fin-bot.vercel.app',
            'http://localhost:5173',
            'http://localhost:5174'
        ].filter(Boolean);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for now to fix the issue
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Root endpoint to prevent "Cannot GET /" on Render
app.get('/', (req, res) => {
    res.send('<h1 style="font-family: sans-serif; text-align: center; margin-top: 50px;">IndiaFinBot API is Live 🚀</h1><p style="font-family: sans-serif; text-align: center; color: #555;">The backend server is running perfectly on Render.</p>');
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'IndiaFinBot Backend is properly aligned and running!' });
});

// Securely proxy the Gemini AI call from the frontend
app.post('/api/chat', async (req, res) => {
    try {
        const { contents, systemInstruction } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: { message: "GEMINI_API_KEY is not configured on the backend server." } });
        }

        // Use correct model names for Gemini API v1
        const models = [
            "gemini-1.5-pro-latest",
            "gemini-1.5-flash-latest",
            "gemini-pro"
        ];
        let data = null;
        let lastError = null;

        for (const model of models) {
            try {
                // For v1 API, prepend system instruction as first user message
                let apiContents = contents;
                if (systemInstruction && systemInstruction.parts && systemInstruction.parts[0]) {
                    const systemText = systemInstruction.parts[0].text;
                    apiContents = [
                        {
                            role: "user",
                            parts: [{ text: systemText }]
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood. I will follow these instructions precisely." }]
                        },
                        ...contents
                    ];
                }
                
                const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: apiContents,
                        generationConfig: {
                            temperature: 0.7,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 8192
                        },
                        safetySettings: [
                            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
                            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
                            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
                            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
                        ]
                    })
                });

                const result = await response.json();

                // If the model hits a high demand limit or quota error, skip and try the next one
                if (result.error) {
                    lastError = result;
                    console.log(`[Failover] ${model} failed: ${result.error.message}`);
                    continue; 
                }

                data = result;
                break; // A model succeeded! Stop looping.

            } catch (err) {
                console.log(`[Failover] ${model} fetch error: ${err.message}`);
                lastError = { error: { message: err.message } };
            }
        }

        if (!data) {
            return res.status(500).json(lastError || { error: { message: "All AI models are currently overwhelmed. Please wait a moment." } });
        }
        
        // Pass the identical JSON response back to the frontend
        res.json(data);
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: { message: "Failed to generate response dynamically." } });
    }
});
// Securely proxy image generation with multiple fallback services
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: { message: "Prompt is required" } });
        }

        // Use Pollinations.ai directly - it's free and reliable
        const seed = Math.floor(Math.random() * 1000000);
        const enhancedPrompt = `${prompt}, high quality, professional, cinematic lighting, detailed, 4k`;
        const encodedPrompt = encodeURIComponent(enhancedPrompt);
        
        // Generate multiple URL options
        const imageUrls = [
            `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`,
            `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`,
            `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}`
        ];
        
        // Return the primary URL
        res.json({ 
            imageUrl: imageUrls[0],
            fallbackUrls: imageUrls.slice(1),
            prompt: enhancedPrompt
        });
        
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ error: { message: "Failed to generate image URL." } });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Render Backend Server successfully aligned and running on port ${PORT}`);
});
