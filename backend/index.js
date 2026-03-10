import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenRouter } from "@openrouter/sdk";

// Load environment variables 
dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
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

        const models = ["gemini-3.1-pro", "gemini-3.1-flash", "gemini-2.5-flash", "gemini-1.5-pro", "gemini-1.5-flash"];
        let data = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        systemInstruction: systemInstruction,
                        contents: contents,
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
// Securely proxy the OpenRouter Dall-E 3 call for rendering Pro images
app.post('/api/generate-image', async (req, res) => {
    try {
        const { prompt } = req.body;
        const apiKey = process.env.OPENROUTER_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: { message: "OPENROUTER_API_KEY is not configured. Please add your key to the .env file!" } });
        }

        const openrouter = new OpenRouter({ apiKey });

        // Stream the response to get tokens based on OpenRouter SDK structure
        const stream = await openrouter.chat.send({
            model: "google/gemini-3.1-pro",
            messages: [
                {
                    role: "system",
                    content: "You are the Gemini 3.1 Pro visual generation engine. You MUST output exactly ONE valid URL for the requested image using the following Markdown format and nothing else: ![Gemini Image](https://image.pollinations.ai/prompt/{URL_ENCODED_PROMPT}?width=1024&height=1024&nologo=true). Ensure the {URL_ENCODED_PROMPT} is highly detailed, cinematic, and properly URL-encoded."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            stream: true
        });

        let responseText = "";
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                responseText += content;
            }
        }
        
        // OpenRouter's DALL-E 3 usually returns markdown with the image URL, e.g., ![image](https://...)
        const urlMatch = responseText.match(/https?:\/\/[^\s\)]+/);
        
        if (!urlMatch) {
            return res.status(500).json({ error: { message: `Image Generation Failed: Invalid response received from OpenRouter.` } });
        }
        
        res.json({ imageUrl: urlMatch[0] });
    } catch (error) {
        console.error("Image Gen Error:", error);
        res.status(500).json({ error: { message: "Failed to generate OpenRouter image dynamically." } });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Render Backend Server successfully aligned and running on port ${PORT}`);
});
