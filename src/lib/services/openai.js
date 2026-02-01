import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeCheckin(checkin) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a compassionate mental health support assistant. Analyze check-in data and provide supportive, non-clinical insights.

Important:
- Be empathetic and validating
- Never diagnose or provide medical advice
- Suggest professional help when appropriate
- Focus on actionable self-care tips

Return JSON:
{
  "sentiment": "positive/neutral/negative/concerning",
  "themes": ["theme1", "theme2"],
  "affirmation": "A supportive message",
  "suggestions": [
    {"activity": "Activity name", "reason": "Why it might help", "duration": "5-10 min"}
  ],
  "resources": ["relevant resource if needed"],
  "followUpQuestions": ["gentle question to encourage reflection"],
  "needsSupport": false
}`,
      },
      {
        role: 'user',
        content: `Analyze this check-in:\nMood: ${checkin.mood}/10\nEnergy: ${checkin.energy}/10\nAnxiety: ${checkin.anxiety}/10\nNote: ${checkin.note || 'No notes'}`,
      },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { affirmation: content, suggestions: [] };
}

export async function generateWeeklyInsights(checkins) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Analyze weekly mental health check-in patterns. Be supportive and highlight positive trends.

Return JSON:
{
  "summary": "Overall week summary",
  "patterns": ["pattern1", "pattern2"],
  "improvements": ["positive changes noticed"],
  "areasOfFocus": ["gentle suggestions"],
  "weeklyAffirmation": "Encouraging message",
  "nextWeekGoal": "Simple achievable goal"
}`,
      },
      {
        role: 'user',
        content: `Weekly check-ins:\n${JSON.stringify(checkins, null, 2)}`,
      },
    ],
    max_tokens: 600,
  });

  const content = response.choices[0].message.content;
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {}
  
  return { summary: content };
}
