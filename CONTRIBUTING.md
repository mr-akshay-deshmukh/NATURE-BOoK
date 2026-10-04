# Contributing to Nature BoOk 🌿

First off, thank you for your interest in contributing to **Nature BoOk**! Our mission is to build software tools that mobilize communities, harness artificial intelligence, and restore natural ecosystems across the planet.

Whether you're fixing a bug, adding new environmental calculation models, or improving the interactive UI, every contribution makes an impact.

---

## 🧭 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all contributors with respect, empathy, and constructive feedback.

---

## 🚀 How to Get Started

### 1. Prerequisites
- **Node.js**: `v20.x` or later (LTS recommended)
- **npm** or **bun**
- Modern Web Browser (Chrome, Firefox, Safari, Edge)
- (Optional for live features) Google Gemini API Key & Google Maps Platform API Key

### 2. Fork & Clone
```bash
git clone https://github.com/your-username/nature-book.git
cd nature-book
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy the example environment file and customize as needed:
```bash
cp .env.example .env
```

Set your keys:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
GOOGLE_MAPS_PLATFORM_KEY="your_google_maps_key_here"
```

### 5. Launch the Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Development Guidelines

### Branching Convention
Create a descriptive branch for your work:
- `feature/description` (e.g., `feature/mangrove-restoration-model`)
- `fix/description` (e.g., `fix/marker-infowindow-close`)
- `docs/description` (e.g., `docs/add-api-specs`)
- `refactor/description` (e.g., `refactor/recharts-responsive-container`)

### Commit Messages
We adhere to the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation updates
- `style:` for formatting/styling changes without code behavior modification
- `refactor:` for code restructuring without feature changes
- `perf:` for performance enhancements
- `test:` for adding or updating tests
- `chore:` for build scripts, configuration, or dependency updates

### Quality Assurance & Linting
Before submitting a PR, always verify:
```bash
# Verify TypeScript types and lint
npm run lint

# Verify full production compilation
npm run build
```

---

## 📬 Submitting a Pull Request

1. Push your branch to your GitHub fork:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request against the `main` branch.
3. Fill out the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md) completely with verification steps and screenshots if UI changes are involved.
4. Respond to any feedback or automated CI checks promptly.

---

## 🧪 Project Architecture Overview

- **`src/`**: Modern React 19 SPA built with Tailwind CSS v4 and Lucide React icons.
  - `src/components/`: Modular domain components (GlobalHazardMap, ReportIssue, SmartSorter, EcoBizIdeator, FutureSolution, BeforeTime, LearnResolve).
  - `src/types.ts`: TypeScript data contracts for reports, biochemical guides, volunteers, and threat profiles.
- **`server.ts`**: Express backend proxy coordinating server-side calls with `@google/genai` (protecting API keys and structuring responses).
- **`metadata.json`**: Application definition and capability registry.

---

Thank you for helping preserve and heal our planet! 🌍
