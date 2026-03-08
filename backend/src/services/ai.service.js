const OpenAI = require('openai');
const axios = require('axios');

let openai;
const getOpenAI = () => {
  if (!openai) openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openai;
};

const SYSTEM_PROMPT = `You are an AI classifier for a community issue reporting platform in India.
Analyze reports and respond ONLY in valid JSON. Be concise and accurate.`;

const analyzeReport = async (report) => {
  try {
    const client = getOpenAI();

    const userPrompt = `Analyze this community report:
Title: ${report.title}
Description: ${report.description}
Category: ${report.category}
Location: ${report.location?.city || 'Unknown'}, ${report.location?.state || 'India'}

Respond with this exact JSON (no markdown, no extra text):
{
  "severity": "CRITICAL|SEVERE|MODERATE",
  "confidence": 0.85,
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "isLegitimate": true,
  "reason": "brief explanation",
  "suggestedCategory": "${report.category}",
  "estimatedAffected": "individual|small_group|community|mass"
}`;

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.3
    });

    const content = completion.choices[0].message.content?.trim();
    const analysis = JSON.parse(content);

    return {
      severity: ['CRITICAL', 'SEVERE', 'MODERATE'].includes(analysis.severity) ? analysis.severity : 'MODERATE',
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords.slice(0, 10) : [],
      confidenceScore: typeof analysis.confidence === 'number' ? analysis.confidence : 0.7,
      isVerified: analysis.isLegitimate !== false,
      isLegitimate: analysis.isLegitimate !== false,
      estimatedAffected: analysis.estimatedAffected || 'small_group',
      analyzedAt: new Date()
    };
  } catch (err) {
    console.error('AI analysis failed:', err.message);
    // Return safe defaults if AI fails
    return {
      severity: 'MODERATE',
      keywords: [],
      confidenceScore: 0.5,
      isVerified: true,
      isLegitimate: true,
      estimatedAffected: 'small_group',
      analyzedAt: new Date()
    };
  }
};

const analyzeImage = async (imageUrl) => {
  try {
    if (!process.env.GOOGLE_CLOUD_API_KEY) return null;

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        requests: [{
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'SAFE_SEARCH_DETECTION' }
          ]
        }]
      }
    );

    const labels = response.data.responses[0]?.labelAnnotations?.map(l => l.description) || [];
    const safeSearch = response.data.responses[0]?.safeSearchAnnotation;

    return { labels, safeSearch };
  } catch (err) {
    console.error('Vision API error:', err.message);
    return null;
  }
};

module.exports = { analyzeReport, analyzeImage };
