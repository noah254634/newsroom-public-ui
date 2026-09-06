# Ugatuzi Public Newsroom UI

Public-facing news publication portal for **Ugatuzi** — Kenya Devolution & Public Finance Intelligence.

Built with Next.js 15 (App Router), React, Tailwind CSS, and Lucide Icons.

## Features

- **Front Page & Hero Carousel**: Real-time rotating carousel for active featured stories.
- **County Coverage**: Filter news by all 47 devolved Kenyan counties.
- **Fact-Checking & Sources**: Transparent claim verification and primary source backing.
- **Data & Statistics Hub**: Devolution spending, absorption rates, and fiscal metrics.
- **Document Search**: Search across published intelligence reports and government dispatches.
- **Responsive & Dark Mode**: Optimized for all screen sizes with instant light/dark mode toggling.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BACKEND_API_URL` | FastApi backend endpoint | `http://127.0.0.1:8000/api` |
