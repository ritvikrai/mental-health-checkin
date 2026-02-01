// Mood analysis utilities

export const MOOD_LABELS = {
  1: 'Very low',
  2: 'Low',
  3: 'Below average',
  4: 'Slightly low',
  5: 'Neutral',
  6: 'Slightly positive',
  7: 'Good',
  8: 'Very good',
  9: 'Great',
  10: 'Excellent',
};

export const SELF_CARE_SUGGESTIONS = {
  lowMood: [
    { activity: 'Take a short walk outside', duration: '10 min', reason: 'Fresh air and movement can help shift perspective' },
    { activity: 'Call or text someone you trust', duration: '5 min', reason: 'Connection with others provides support' },
    { activity: 'Listen to uplifting music', duration: '15 min', reason: 'Music can influence our emotional state' },
  ],
  lowEnergy: [
    { activity: 'Power nap', duration: '20 min', reason: 'Short rest can restore energy' },
    { activity: 'Drink water and have a healthy snack', duration: '5 min', reason: 'Hydration and nutrition impact energy' },
    { activity: 'Do some gentle stretching', duration: '10 min', reason: 'Movement increases blood flow and energy' },
  ],
  highAnxiety: [
    { activity: 'Box breathing exercise', duration: '5 min', reason: 'Controlled breathing activates relaxation response' },
    { activity: 'Write down your worries', duration: '10 min', reason: 'Externalizing thoughts can reduce their power' },
    { activity: 'Progressive muscle relaxation', duration: '15 min', reason: 'Releasing physical tension helps mental calm' },
  ],
};

export function getSuggestions(checkin) {
  const suggestions = [];
  
  if (checkin.mood <= 4) {
    suggestions.push(...SELF_CARE_SUGGESTIONS.lowMood);
  }
  if (checkin.energy <= 4) {
    suggestions.push(...SELF_CARE_SUGGESTIONS.lowEnergy);
  }
  if (checkin.anxiety >= 7) {
    suggestions.push(...SELF_CARE_SUGGESTIONS.highAnxiety);
  }
  
  // Dedupe and limit
  return suggestions.slice(0, 3);
}

export function calculateTrend(checkins, metric) {
  if (checkins.length < 2) return 'stable';
  
  const recent = checkins.slice(0, 3).map(c => c[metric]);
  const earlier = checkins.slice(3, 6).map(c => c[metric]);
  
  if (earlier.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
  
  const diff = recentAvg - earlierAvg;
  
  if (Math.abs(diff) < 0.5) return 'stable';
  return diff > 0 ? 'improving' : 'declining';
}

export function getAffirmation() {
  const affirmations = [
    "You're doing great by checking in with yourself.",
    "Every day is a new opportunity for growth.",
    "Your feelings are valid and important.",
    "Taking care of your mental health shows strength.",
    "Progress isn't always linear, and that's okay.",
    "You deserve compassion, especially from yourself.",
    "Small steps forward still count as progress.",
  ];
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}
