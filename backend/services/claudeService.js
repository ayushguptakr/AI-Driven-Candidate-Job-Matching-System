const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

const analyzeMatch = async (jobDescription, resumeContent) => {
  try {
    const prompt = `
Analyze the match between this job description and resume. Return a JSON response with:
1. score (0-100): Overall match percentage
2. matchingSkills: Array of skills that match
3. reasoning: Brief explanation

Job Description:
${jobDescription}

Resume:
${resumeContent}

Respond only with valid JSON.`;

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    const response = JSON.parse(message.content[0].text);
    return {
      score: response.score || 0,
      matchingSkills: response.matchingSkills || [],
      reasoning: response.reasoning || ''
    };
  } catch (error) {
    console.error('Claude API error:', error);
    return { score: 0, matchingSkills: [], reasoning: 'Analysis failed' };
  }
};

module.exports = { analyzeMatch };



