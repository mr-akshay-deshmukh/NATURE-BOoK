<div align="center">

# 🌿 Nature BoOk
### Next-Generation Biospheric Remediation Protocol & Planetary Health Engine

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge&logo=github-actions)](https://github.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Google Maps Platform](https://img.shields.io/badge/Maps-Google_Maps_Platform-34A853?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<br />

**Nature BoOk** is a mission-critical environmental intelligence and bio-remediation platform. It empowers citizens, scientists, and ecological responders to report environmental hazards in real-time, generate automated biochemical remediation protocols using Google Gemini AI, sort recyclable materials, build sustainable circular-economy business models, and model planetary hazards across historical and future timelines.

[Explore Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-endpoints) • [Contributing](#-contributing)

---

</div>

## 📑 Table of Contents

- [✨ Core Features](#-core-features)
- [🏗️ System Architecture](#️-system-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔑 Environment Variables](#-environment-variables)
- [📡 API Endpoints](#-api-endpoints)
- [📂 Project Structure](#-project-structure)
- [🧪 Scripts & Commands](#-scripts--commands)
- [🗺️ Google Maps & Gemini Integration](#️-google-maps--gemini-integration)
- [🤝 Contributing](#-contributing)
- [🛡️ Security](#️-security)
- [📄 License](#-license)

---

## ✨ Core Features

### 1. 🗺️ Global Threat Map & Spatial Intelligence
- Built on the official **Google Maps Platform** via `@vis.gl/react-google-maps`.
- Visualizes environmental crisis sites worldwide with real-time coordinate plotting.
- Dynamic color-coded status pins:
  - 🔴 **Reported**: Newly logged ecological threat awaiting triage.
  - 🟡 **Analyzing**: AI bio-remediation engine generating action pathways.
  - 🔵 **Implementing**: Community responders and bio-materials actively deployed.
  - 🟢 **Resolved**: Habitat restored and verification metrics confirmed.
- Interactive information windows with instant report inspection and direct zoom.

### 2. 📊 Live Impact & Ecological Analytics Dashboard
- Real-time aggregation of active incidents, remediation rates, and volunteer counts.
- **Success Velocity Indicator**: Real-time velocity tracker highlighting remediation momentum.
- **Interactive Recharts Visualizations**:
  - Threat Category Distribution (Deforestation, Water Pollution, Waste Dumps, Toxic Runoff).
  - Remediation Progress Velocity curve over time.
  - Geographical hotspot density bar charts.

### 3. 🚨 Real-Time Hazard Reporting Engine
- High-precision geo-tagging using browser HTML5 Geolocation API.
- Photo attachment support with instant thumbnail generation and visual inspection.
- **One-Click Ecological Presets**: Preloaded real-world scenarios for rapid testing:
  - *Amazonian Deforestation Area* (Canopy loss & boundary erosion).
  - *River Degradation* (Industrial detergent discharge & microplastic sludge).
  - *Illegal Electronic Waste Dump* (Heavy metal runoff & lead/mercury accumulation).

### 4. 🧠 Autonomous Biochemical Remediation Router (Gemini AI)
- Leverages Google Gemini 2.5 Flash / Flash-Lite models via the `@google/genai` TypeScript SDK.
- Automatically diagnoses incoming incidents and outputs structured JSON remediation guides:
  - **Immediate Containment Actions**: Sorbent booms, sediment fences, diversion ditches.
  - **Long-Term Biochemical Restorations**: Mycoremediation with oyster mushroom mycelium, hyperaccumulator phytoremediation (*sunflowers, brassica juncea*), biochar injection.
  - **Required Materials & Equipment**: Detailed resource checklist.
  - **Field Safety Precautions**: Protective equipment requirements and toxic threshold warnings.

### 5. ♻️ Multimodal Smart Waste Sorter
- AI-powered waste classification system analyzing material composition.
- Deconstructs uploaded waste items into:
  - Recyclability index and bin allocation (Compost, Plastic, E-Waste, Hazardous).
  - Environmental biodegradation half-life estimates.
  - Carbon footprint impact analysis.
  - Step-by-step circular disposal instructions.

### 6. 💡 Eco-Biz Ideator: Waste-to-Wealth Engine
- Circular economy generator that transforms ecological waste streams into viable commercial enterprises.
- Synthesizes:
  - Business concept name and executive summary.
  - Raw material feedstock specifications.
  - Product transformation roadmap (e.g., turning river plastic into marine-grade structural lumber).
  - Estimated capital expenditures, operating margins, and market scalability metrics.

### 7. ⏳ "Before Time" Historical Catastrophe Archive
- In-depth interactive chronology of humanity's defining ecological disasters:
  - Bhopal Gas Tragedy (1984)
  - Minamata Mercury Poisoning (1956)
  - Deepwater Horizon Subsea Blowout (2010)
  - Chernobyl Nuclear Exclusion Zone (1986)
- Highlights lasting ecological impacts, government policy fallout, and engineering lessons learned to prevent future recurrence.

### 8. 🔮 "Future Solutions" Geoengineering Projections
- Predictive hazard modeling forecasting emerging macro-threats:
  - Yamal Peninsula Cryo-Methane Sinkhole Eruptions.
  - Oceanic Carbonic Acid Calcification Collapse.
- Interactive human countermeasure evaluator: Submit hypothetical solutions to receive instant AI feasibility, implementation velocity, and ecological risk ratings.

### 9. 🤝 Citizen Volunteer Mobilization
- Direct community action sign-up portal integrated into every report.
- Field workers can pledge specific equipment, lab analysis, or labor hours to active remediation zones.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (React 19 SPA)                    │
│                                                             │
│   ┌───────────────────┐    ┌────────────────────────────┐   │
│   │  Tailwind CSS v4  │    │  @vis.gl/react-google-maps │   │
│   └───────────────────┘    └─────────────┬──────────────┘   │
│   ┌───────────────────┐                  │ (Direct Tiles)   │
│   │     Recharts      │                  ▼                  │
│   └─────────┬─────────┘    ┌────────────────────────────┐   │
│             │              │   Google Maps Platform     │   │
│             ▼              └────────────────────────────┘   │
└─────────────┬───────────────────────────────────────────────┘
              │ JSON API via Vite Proxy
              ▼
┌─────────────────────────────────────────────────────────────┐
│               Server Proxy (Express + Node.js)              │
│                                                             │
│   • /api/analyze-issue          • /api/generate-business    │
│   • /api/sort-waste             • /api/future-threats       │
│   • /api/evaluate-future-solution                           │
└─────────────┬───────────────────────────────────────────────┘
              │ Secure Server-Side Requests
              ▼
┌─────────────────────────────────────────────────────────────┐
│               Google Gemini API (@google/genai)             │
│            • gemini-2.5-flash / gemini-2.5-flash-lite        │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | High-performance reactive UI with modern hooks |
| **Build Tool** | Vite 6 | Lightning-fast HMR and optimized production bundle |
| **Styling** | Tailwind CSS v4 | High-fidelity dark glassmorphic green/noir design system |
| **Icons & Visuals** | Lucide React | Clean, scalable vector symbology |
| **Charting** | Recharts 3 | Responsive SVG graphs, bar charts, and radial metrics |
| **Mapping Engine** | `@vis.gl/react-google-maps` | Official Google Maps Platform integration for React |
| **Backend Runtime** | Node.js + Express 4 | Server-side API proxy securing external credentials |
| **Artificial Intelligence** | `@google/genai` (Gemini SDK) | State-of-the-art multimodal generative intelligence |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) version 20.x or higher
- `npm` or `bun`
- A Google Cloud Platform account with **Maps JavaScript API** enabled
- A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nature-book.git
cd nature-book
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your API credentials:
```env
GEMINI_API_KEY="your_actual_gemini_api_key"
GOOGLE_MAPS_PLATFORM_KEY="your_actual_maps_api_key"
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Environment Variables

| Variable Name | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | **Yes** | API key used by the server to invoke Google Gemini models. |
| `GOOGLE_MAPS_PLATFORM_KEY` | **Yes** | Google Maps Platform API key with Maps JavaScript API enabled. |
| `VITE_GOOGLE_MAPS_PLATFORM_KEY` | Optional | Fallback client-accessible environment key for mapping. |
| `APP_URL` | Optional | Full base URL of the deployed application (defaults to `http://localhost:3000`). |
| `PORT` | Optional | Backend listening port (default: `3000`). |

---

## 📡 API Endpoints

All backend routes are served via Express in `server.ts` to keep API keys secure:

### `POST /api/analyze-issue`
Generates a structured biochemical remediation protocol for an incident.
- **Request Body**:
  ```json
  {
    "title": "Industrial Sludge in River",
    "description": "Chemical residue leaking into tributary",
    "category": "water_pollution",
    "fileUrl": "data:image/jpeg;base64,...",
    "fileType": "image/jpeg"
  }
  ```
- **Response**:
  ```json
  {
    "summary": "High-risk surfactant contamination threatening downstream biota.",
    "immediateSteps": ["Deploy oleophilic containment booms", "Divert intake valves"],
    "longTermSolutions": ["Establish wetland bio-swales", "Inoculate with Pleurotus ostreatus"],
    "neededResources": ["Floating booms", "Water quality testing probes"],
    "safetyPrecautions": ["Nitrile gloves and vapor-rated respirators mandatory"]
  }
  ```

### `POST /api/sort-waste`
Analyzes item images or descriptions to provide recyclability, lifespan, and disposal recommendations.

### `POST /api/generate-business`
Synthesizes a circular economy waste-to-wealth business plan based on user-supplied material inputs.

### `GET /api/future-threats`
Retrieves pre-computed and dynamically forecasted planetary risk scenarios.

### `POST /api/evaluate-future-solution`
Evaluates human engineering proposals against future climate threats, scoring feasibility, deployment speed, and ecological trade-offs.

---

## 📂 Project Structure

```
nature-book/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml          # Structured GitHub bug reporting form
│   │   └── feature_request.yml     # Feature proposal workflow
│   ├── workflows/
│   │   └── ci.yml                  # GitHub Actions CI build & lint verification
│   └── PULL_REQUEST_TEMPLATE.md    # Standardized pull request template
├── src/
│   ├── components/
│   │   ├── BeforeTime.tsx          # Historical disaster retrospective archive
│   │   ├── EcoBizIdeator.tsx       # Waste-to-business venture engine
│   │   ├── EnvironmentalDashboard.tsx # Metrics, charts, & velocity indicators
│   │   ├── FutureSolution.tsx      # Geoengineering simulation & solution rater
│   │   ├── GlobalHazardMap.tsx     # Google Maps Platform incident view
│   │   ├── LearnResolve.tsx        # Environmental education modules
│   │   ├── LoginModal.tsx          # Animated authentication modal
│   │   ├── ReportIssue.tsx         # Real-time incident submission & triage
│   │   ├── ReportModal.tsx         # Quick reporting modal dialog
│   │   ├── SmartSorter.tsx         # Multimodal waste classification tool
│   │   └── ToastNotification.tsx   # Toast notification dispatcher
│   ├── App.tsx                     # Main application layout, routing & state
│   ├── main.tsx                    # React DOM entry point
│   ├── index.css                   # Global styles & Tailwind CSS v4 import
│   └── types.ts                    # TypeScript definitions & interfaces
├── server.ts                       # Express backend proxy for Google Gemini AI
├── index.html                      # HTML5 template & application entry
├── metadata.json                   # Cloud workspace configuration
├── tsconfig.json                   # Strict TypeScript compiler settings
├── vite.config.ts                  # Vite build & bundler configuration
├── package.json                    # Project dependencies and script definitions
├── .env.example                    # Environment variable documentation
├── CONTRIBUTING.md                 # Contribution guidelines & branching conventions
├── CODE_OF_CONDUCT.md              # Contributor Covenant v2.1 code of conduct
├── SECURITY.md                     # Security reporting policy & disclosure guide
└── LICENSE                         # MIT License
```

---

## 🧪 Scripts & Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the Express server and Vite development bundler concurrently on port 3000. |
| `npm run build` | Builds the client SPA using Vite and compiles `server.ts` into a standalone bundle. |
| `npm run start` | Runs the compiled production server (`node dist/server.cjs`). |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) to prevent build regressions. |
| `npm run clean` | Removes compiled artifacts and dist directory. |

---

## 🗺️ Google Maps & Gemini Integration

### Google Maps Platform
Nature BoOk uses the latest functional React components from `@vis.gl/react-google-maps`.
To customize the map styling or add custom layers:
1. Navigate to `src/components/GlobalHazardMap.tsx`.
2. Inspect the `<Map>` container and `<AdvancedMarker>` pins.
3. Markers dynamically recalculate position and pin tint based on incident threat level.

### Gemini AI Engine
Server-side integration is centralized in `server.ts`:
```typescript
import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: prompt,
  config: { responseMimeType: 'application/json' }
});
```

---

## 🤝 Contributing

We welcome contributions from developers, designers, and environmental advocates worldwide!
Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting pull requests.

1. Fork the repo and create your branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add drone imagery analyzer'`.
3. Push to your fork: `git push origin feature/amazing-feature`.
4. Open a Pull Request!

---

## 🛡️ Security

For vulnerability reports and disclosure guidelines, please see [SECURITY.md](SECURITY.md).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with 🌿 for a cleaner, resilient planet. Nature BoOk Modules.</sub>
</div>
