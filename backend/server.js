import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://hiremindcom.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'HireMind Backend is running!' });
});

// Generate content endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { name, jobTitle, skills, experienceLevel, jobDescription, tone, type } = req.body;

    // Validate required fields
    if (!name || !jobTitle || !skills || !tone || !type) {
      return res.status(400).json({
        error: 'Missing required fields: name, jobTitle, skills, tone, and type are required'
      });
    }

    // Validate API key
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        error: 'OpenRouter API key not configured'
      });
    }

    // Create prompt based on type
    let prompt;
    if (type === 'resume') {
      prompt = `You are an expert resume writer. Based on the following user data, generate a professional resume:

Name: ${name}
Job Title: ${jobTitle}
Skills: ${skills}
Experience Level: ${experienceLevel || 'Not specified'}
${jobDescription ? `Target Job Description: ${jobDescription}` : ''}
Tone: ${tone}

Generate a complete, professional resume with the following sections:
1. Professional Summary (2-3 sentences)
2. Core Skills (bullet points)
3. Professional Experience (if experience level provided, create relevant examples)
4. Education (create appropriate education background)

Format the output as a clean, professional resume. Use ${tone.toLowerCase()} tone throughout.`;
    } else if (type === 'cover-letter') {
      prompt = `You are an expert cover letter writer. Based on the following user data, generate a professional cover letter:

Name: ${name}
Job Title: ${jobTitle}
Skills: ${skills}
Experience Level: ${experienceLevel || 'Not specified'}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
Tone: ${tone}

Generate a complete, professional cover letter that:
1. Opens with a strong introduction
2. Highlights relevant skills and experience
3. Shows enthusiasm for the role
4. Closes with a call to action
5. Uses ${tone.toLowerCase()} tone throughout

Format as a proper business letter.`;
    } else {
      return res.status(400).json({
        error: 'Invalid type. Must be either "resume" or "cover-letter"'
      });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'HireMind'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b:free',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API Error:', errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || 'Failed to generate content'
      });
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid API Response:', data);
      return res.status(500).json({
        error: 'Invalid response from AI service'
      });
    }

    const generatedContent = data.choices[0].message.content;

    res.json({
      success: true,
      content: generatedContent,
      type: type,
      metadata: {
        model: data.model,
        usage: data.usage
      }
    });

  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 HireMind Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 API endpoint: http://localhost:${PORT}/api/generate`);
});