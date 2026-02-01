import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CHECKINS_FILE = path.join(DATA_DIR, 'checkins.json');
const GOALS_FILE = path.join(DATA_DIR, 'goals.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Check-ins
export async function saveCheckin(checkin) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(CHECKINS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { checkins: [], streak: 0, lastCheckin: null };
  }
  
  const entry = {
    id: Date.now().toString(),
    ...checkin,
    createdAt: new Date().toISOString(),
  };
  
  // Calculate streak
  const today = new Date().toDateString();
  const lastDate = data.lastCheckin ? new Date(data.lastCheckin).toDateString() : null;
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  
  if (lastDate === yesterday) {
    data.streak++;
  } else if (lastDate !== today) {
    data.streak = 1;
  }
  
  data.lastCheckin = new Date().toISOString();
  data.checkins.unshift(entry);
  data.checkins = data.checkins.slice(0, 365); // Keep a year
  
  await fs.writeFile(CHECKINS_FILE, JSON.stringify(data, null, 2));
  return { checkin: entry, streak: data.streak };
}

export async function getCheckins(days = 30) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(CHECKINS_FILE, 'utf-8');
    const data = JSON.parse(file);
    
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const filtered = data.checkins.filter(c => new Date(c.createdAt) >= cutoff);
    
    return {
      checkins: filtered,
      streak: data.streak,
      total: data.checkins.length,
    };
  } catch (e) {
    return { checkins: [], streak: 0, total: 0 };
  }
}

export async function getStats() {
  const { checkins, streak, total } = await getCheckins(30);
  
  if (checkins.length === 0) {
    return { streak, total, averages: null };
  }
  
  const averages = {
    mood: checkins.reduce((sum, c) => sum + c.mood, 0) / checkins.length,
    energy: checkins.reduce((sum, c) => sum + c.energy, 0) / checkins.length,
    anxiety: checkins.reduce((sum, c) => sum + c.anxiety, 0) / checkins.length,
  };
  
  return { streak, total, averages, recentCount: checkins.length };
}

// Goals
export async function getGoals() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(GOALS_FILE, 'utf-8');
    return JSON.parse(file).goals;
  } catch (e) {
    return [];
  }
}

export async function saveGoal(goal) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(GOALS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { goals: [] };
  }
  
  const entry = {
    id: Date.now().toString(),
    ...goal,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  data.goals.push(entry);
  await fs.writeFile(GOALS_FILE, JSON.stringify(data, null, 2));
  return entry;
}

export async function updateGoal(id, updates) {
  await ensureDataDir();
  try {
    const file = await fs.readFile(GOALS_FILE, 'utf-8');
    const data = JSON.parse(file);
    const goal = data.goals.find(g => g.id === id);
    if (goal) {
      Object.assign(goal, updates, { updatedAt: new Date().toISOString() });
      await fs.writeFile(GOALS_FILE, JSON.stringify(data, null, 2));
    }
    return goal;
  } catch (e) {
    return null;
  }
}
