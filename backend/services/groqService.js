const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROK_API_KEY,
});

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

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 1000,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content?.trim() || '{}';
    const response = JSON.parse(text);

    return {
      score: response.score || 0,
      matchingSkills: response.matchingSkills || [],
      missingSkills: response.missingSkills || [],
      reasoning: response.reasoning || ''
    };
  } catch (error) {
    console.error('Groq API error:', error.message || error);
    return { score: 0, matchingSkills: [], missingSkills: [], reasoning: 'Analysis failed' };
  }
};

module.exports = { analyzeMatch };
