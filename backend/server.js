import express from "express";
import path from "path";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Serve static files from the frontend folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "frontend")));

// Route to serve the main frontend page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// API endpoint for OpenAI
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;
  const messages = [{ role: "user", content: userMessage }];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        max_tokens: 100,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error communicating with OpenAI API");
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
