import { NextResponse } from 'next/server';
import { analyzeCheckin } from '@/lib/services/openai';
import { getSuggestions, getAffirmation } from '@/lib/services/mood';
import { saveCheckin, getCheckins } from '@/lib/services/storage';

export async function POST(request) {
  try {
    const checkin = await request.json();

    if (checkin.mood === undefined || checkin.energy === undefined || checkin.anxiety === undefined) {
      return NextResponse.json(
        { error: 'Mood, energy, and anxiety ratings required' },
        { status: 400 }
      );
    }

    let analysis;

    if (process.env.OPENAI_API_KEY) {
      analysis = await analyzeCheckin(checkin);
    } else {
      // Basic analysis without AI
      analysis = {
        sentiment: checkin.mood >= 7 ? 'positive' : checkin.mood >= 4 ? 'neutral' : 'concerning',
        affirmation: getAffirmation(),
        suggestions: getSuggestions(checkin),
        needsSupport: checkin.mood <= 2 || checkin.anxiety >= 9,
        note: 'Add OPENAI_API_KEY for personalized AI insights',
      };
    }

    const { checkin: saved, streak } = await saveCheckin({
      ...checkin,
      analysis,
    });

    return NextResponse.json({
      success: true,
      checkin: saved,
      analysis,
      streak,
    });
  } catch (error) {
    console.error('Checkin error:', error);
    return NextResponse.json(
      { error: 'Failed to save check-in', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const data = await getCheckins(days);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get checkins error:', error);
    return NextResponse.json(
      { error: 'Failed to get check-ins' },
      { status: 500 }
    );
  }
}
