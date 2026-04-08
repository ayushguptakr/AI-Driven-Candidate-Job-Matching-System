const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models to try in order — each has its own separate quota pool
const MODEL_PRIORITY = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callWithRetry = async (prompt, retries = 3) => {
  for (const modelName of MODEL_PRIORITY) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
        return JSON.parse(cleaned);
      } catch (error) {
        const is429 = error.message?.includes('429') || error.message?.includes('quota');
        
        if (is429 && attempt < retries) {
          // Retry after delay (exponential backoff)
          const delay = attempt * 15000; // 15s, 30s, 45s
          console.log(`Rate limited on ${modelName}, retrying in ${delay / 1000}s (attempt ${attempt}/${retries})...`);
          await sleep(delay);
          continue;
        }
        
        if (is429) {
          // Quota exhausted on this model, try next model
          console.log(`Quota exhausted on ${modelName}, trying next model...`);
          break;
        }
        
        // Non-rate-limit error — throw immediately
        throw error;
      }
    }
  }
  
  throw new Error('All Gemini models quota exhausted. Please wait or check billing at https://ai.google.dev');
};

const analyzeMatch = async (jobDescription, resumeContent) => {
  try {
    const prompt = `
Analyze the match between this job description and resume. Return a JSON response with:
1. score (0-100): Overall match percentage
2. matchingSkills: Array of skills that match
3. missingSkills: Array of required skills the candidate lacks
4. reasoning: Brief explanation (2-3 sentences)

Job Description:
${jobDescription}

Resume:
${resumeContent}

Respond ONLY with valid JSON, no markdown formatting or code blocks.`;

    const response = await callWithRetry(prompt);

    return {
      score: response.score || 0,
      matchingSkills: response.matchingSkills || [],
      missingSkills: response.missingSkills || [],
      reasoning: response.reasoning || ''
    };
  } catch (error) {
    console.error('Gemini API error:', error.message || error);
    return { score: 0, matchingSkills: [], missingSkills: [], reasoning: 'Analysis failed — API quota exceeded. Please try again later.' };
  }
};

module.exports = { analyzeMatch };
