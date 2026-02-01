# Mental Health Check-in

Daily mood tracking with AI-powered wellness suggestions.

## Features

- 😊 Daily mood check-ins
- 📝 Journal entries with sentiment analysis
- 📊 Mood trends and patterns
- 💡 Personalized wellness suggestions
- 🔔 Gentle reminders

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI GPT-4o-mini
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/checkin` | Log mood and journal |
| GET | `/api/stats` | Get mood statistics |

## Privacy

All data is stored locally. No data is sent to external services except for AI analysis (optional).

## Demo Mode

Works without API key with basic mood tracking.

## License

MIT
