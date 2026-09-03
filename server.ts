import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not configured.');
    }
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'AuraLens' });
});

// Study companion (AuraBuddy) endpoint using Gemini 3.8 Flash
app.post('/api/study/companion', async (req, res) => {
  try {
    const { prompt, topic, studyState, mode } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getGenAI();

    let systemInstruction = `You are AuraBuddy, the gentle, brilliant, and mindful AI study companion inside AuraLens.
Tone: Serene, encouraging, clear, grounded, intellectually precise yet calming.
Avoid robotic fluff, dry corporate speak, or intimidating academic walls of text.
When explaining concepts, use illuminating analogies, vivid metaphors, and structured takeaways.
If the student's current aura state is Elevated or Rising, begin with a 1-sentence soothing anchor sentence before diving in.`;

    if (mode === 'breakdown') {
      systemInstruction += '\nTask: Provide the intuitive mental model of the concept, 3 core pillars with bullet points, and 1 memorable everyday analogy.';
    } else if (mode === 'recap') {
      systemInstruction += '\nTask: Provide exactly 3 high-yield bullet points that lock this concept into long-term memory.';
    } else if (mode === 'flashcards') {
      systemInstruction += `\nTask: Generate 3 high-yield study flashcards for this topic.
Format your output as valid JSON with this exact structure:
{
  "reply": "Here are 3 high-yield flashcards to test your understanding gently:",
  "flashcards": [
    { "front": "Question / Prompt", "back": "Clear concise answer" }
  ]
}`;
    } else if (mode === 'quiz') {
      systemInstruction += `\nTask: Generate 1 thoughtful conceptual multiple-choice quiz question with 4 options to test retention.
Format your output as valid JSON with this exact structure:
{
  "reply": "Here is a quick check to anchor your intuition:",
  "quiz": {
    "question": "The question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Brief compassionate explanation of why this option is correct."
  }
}`;
    }

    const isJsonMode = mode === 'flashcards' || mode === 'quiz';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Student aura state: ${studyState || 'Stable'}. Topic: ${topic || 'Current study focus'}.\nUser prompt: ${prompt}`,
            },
          ],
        },
      ],
      config: {
        systemInstruction,
        temperature: 0.6,
        maxOutputTokens: 800,
        ...(isJsonMode ? { responseMimeType: 'application/json' } : {}),
      },
    });

    const rawText = response.text || '';
    if (isJsonMode) {
      try {
        const parsed = JSON.parse(rawText);
        return res.json({
          reply: parsed.reply || 'Here is your practice review:',
          flashcards: parsed.flashcards,
          quiz: parsed.quiz,
        });
      } catch (parseErr) {
        console.warn('JSON parsing fallback for mode:', mode, parseErr);
        return res.json({ reply: rawText });
      }
    }

    res.json({ reply: rawText || 'Take a soft breath. You are doing wonderful work.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to consult study companion';
    console.error('Study companion error:', err);
    res.status(500).json({ error: message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AuraLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
