# 🎨 DruGraph Frontend - React + TypeScript + Vite

Modern, cyberpunk-themed clinical intelligence interface built with **React**, **TypeScript**, and **Vite**.

---

## 🎯 Features

### 🔍 **Search View**
- Semantic drug discovery
- Real-time vector similarity search
- Drug cards with quick actions (Watch, Check, Graph)
- Relevance scoring

### 🤖 **Assistant View**
- RAG-powered chat interface
- Explainable AI responses
- Source citations (Cypher queries + vector snippets)
- Conversation history

### ⚠️ **Safety View**
- Multi-drug interaction checker
- Severity classification (Critical/Major/Minor)
- Intelligent alternative suggestions
- Sample case testing

### 🌐 **Graph View**
- Interactive force-directed graph
- Drug-Target-Category relationships
- Dynamic filtering and exploration
- Pathfinding mode

### 💊 **Alternatives View**
- Therapeutic alternative finder
- Conflict-based ranking
- Same-category recommendations
- Current medication consideration

---

## 📦 Installation

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn**

### Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🚀 Development

### Available Scripts

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── TopBar.tsx           # Header bar
│   │   │   ├── RightDrawer.tsx      # Drug details drawer
│   │   │   ├── ToastContainer.tsx   # Notifications
│   │   │   └── HexGrid.tsx          # Background effect
│   │   └── pillars/
│   │       ├── Search/
│   │       │   ├── SearchView.tsx   # Main search interface
│   │       │   └── DrugCard.tsx     # Drug result card
│   │       ├── Assistant/
│   │       │   └── AssistantView.tsx # RAG chat interface
│   │       ├── Safety/
│   │       │   └── SafetyView.tsx   # Interaction checker
│   │       ├── Graph/
│   │       │   └── GraphView.tsx    # Knowledge graph viz
│   │       └── Alternatives/
│   │           └── AlternativesView.tsx # Alternative finder
│   ├── services/
│   │   └── api.ts                   # API client (Axios)
│   ├── store/
│   │   └── index.ts                 # Zustand state management
│   ├── types/
│   │   └── index.ts                 # TypeScript definitions
│   ├── hooks/
│   │   └── useAnimatedCounter.ts    # Custom hooks
│   ├── data/
│   │   └── mock.ts                  # Mock data
│   ├── App.tsx                      # Root component
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles + theme
├── public/                          # Static assets
├── index.html                       # HTML template
├── vite.config.ts                   # Vite configuration
├── tsconfig.json                    # TypeScript config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── package.json
└── README.md
```

---

## 🎨 Design System

### Color Palette (Cyberpunk Theme)

```css
:root {
  /* Backgrounds */
  --bg-void: #04080F;           /* Deepest background */
  --bg-surface: #080E1A;        /* Surface level */
  --bg-elevated: #0D1525;       /* Elevated elements */
  
  /* Accents */
  --accent-bio: #00E5C3;        /* Primary (bio-tech cyan) */
  --accent-warm: #E8A838;       /* Warning (amber) */
  --accent-danger: #FF4560;     /* Critical (red) */
  --accent-safe: #22C97A;       /* Safe (green) */
  --accent-dim: #1A3A5C;        /* Borders */
  
  /* Text */
  --text-primary: #E2EEF6;      /* Primary text */
  --text-secondary: #7A9BB5;    /* Secondary text */
  --text-muted: #3A5570;        /* Muted text */
  
  /* Fonts */
  --font-display: 'DM Mono', monospace;
  --font-body: 'Geist', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Component Classes

```css
/* Card with hover effect */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--accent-dim);
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(0,229,195,0.06);
}

/* Primary button */
.btn-bio {
  background: transparent;
  border: 1px solid var(--accent-bio);
  color: var(--accent-bio);
  font-family: var(--font-display);
}

/* Severity indicators */
.severity-critical { border-left: 3px solid var(--accent-danger); }
.severity-major { border-left: 3px solid var(--accent-warm); }
.severity-minor { border-left: 3px solid var(--text-muted); }
```

---

## 🔌 API Integration

### API Client (`services/api.ts`)

```typescript
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  // Search
  search: async (query: string, k: number = 5) => {
    const res = await client.post('/search', { query, k });
    return res.data.results;
  },

  // Assistant
  ask: async (question: string) => {
    const res = await client.post('/ask', { question });
    return res.data;
  },

  // Safety
  checkInteractions: async (drugs: string[]) => {
    const res = await client.post('/check', { drugs });
    return res.data.interactions;
  },

  // Graph
  getGraph: async (limit: number = 200) => {
    const res = await client.get('/graph', { params: { limit } });
    return res.data;
  },

  // Drug Details
  getDrugDetails: async (drugId: string) => {
    const res = await client.get(`/drug/${drugId}`);
    return res.data;
  },

  // Alternatives
  getAlternatives: async (drug: string, condition: string, currentMeds: string = '') => {
    const encodedDrug = encodeURIComponent(drug);
    const encodedCondition = encodeURIComponent(condition);
    const params = currentMeds ? { current_meds: currentMeds } : {};
    const res = await client.get(`/alternatives/${encodedDrug}/${encodedCondition}`, { params });
    return res.data;
  },
};
```

---

## 🗂️ State Management (Zustand)

### Global Store (`store/index.ts`)

```typescript
interface AppState {
  // View state
  activeView: PillarView;
  setActiveView: (view: PillarView) => void;

  // Watchlist
  watchlist: Drug[];
  addToWatchlist: (drug: Drug) => void;
  removeFromWatchlist: (drugId: string) => void;

  // Safety checker
  checkerDrugs: string[];
  addCheckerDrug: (drug: string) => void;
  removeCheckerDrug: (drug: string) => void;

  // Chat history
  chatHistory: Message[];
  addMessage: (message: Message) => void;

  // Notifications
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type']) => void;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */
```

### Layout Strategy

- **Sidebar:** Fixed width (240px) on desktop, collapsible on mobile
- **Main Content:** Flexible, scrollable
- **Right Drawer:** Slide-in overlay for drug details

---

## 🎭 Animations

### CSS Animations

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scanSweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
```

### Usage

```tsx
<div className="animate-fade-in">Content</div>
<div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
  Staggered content
</div>
```

---

## 🧩 Key Dependencies

### Core
- **react** (18.3.1) - UI library
- **react-dom** (18.3.1) - DOM rendering
- **typescript** (5.5.3) - Type safety

### State & Data
- **zustand** (5.0.12) - State management
- **@tanstack/react-query** (5.99.0) - Server state
- **axios** (1.15.0) - HTTP client

### UI & Visualization
- **lucide-react** (0.344.0) - Icons
- **react-force-graph-2d** (1.29.1) - Graph visualization
- **recharts** (3.8.1) - Charts
- **tailwindcss** (3.4.1) - Utility CSS

### Build Tools
- **vite** (5.4.2) - Build tool
- **@vitejs/plugin-react** (4.3.1) - React plugin
- **eslint** (9.9.1) - Linting
- **typescript-eslint** (8.3.0) - TS linting

---

## 🔧 Configuration

### Vite Config (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### TypeScript Config (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## 🐛 Troubleshooting

### CORS Issues
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS middleware in backend `api/main.py`

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Run type checking
npm run typecheck
```

---

## 📚 Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Frontend crafted with precision by Harsha** ✨
