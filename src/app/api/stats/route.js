import { NextResponse } from 'next/server';
import { generateWeeklyInsights } from '@/lib/services/openai';
import { getStats, getCheckins } from '@/lib/services/storage';
import { calculateTrend } from '@/lib/services/mood';

export async function GET() {
  try {
    const stats = await getStats();
    const { checkins } = await getCheckins(7);

    const trends = {
      mood: calculateTrend(checkins, 'mood'),
      energy: calculateTrend(checkins, 'energy'),
      anxiety: calculateTrend(checkins, 'anxiety'),
    };

    let weeklyInsights = null;

    if (process.env.OPENAI_API_KEY && checkins.length >= 3) {
      try {
        weeklyInsights = await generateWeeklyInsights(checkins);
      } catch (e) {
        console.error('Weekly insights error:', e);
      }
    }

    return NextResponse.json({
      ...stats,
      trends,
      weeklyInsights,
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}
