# CareerForge Pro — ATS-Proof Resume Generator

## 🚀 Complete Setup Guide (VSCode)

### Prerequisites
- Node.js v18+ (https://nodejs.org)
- npm v9+
- A free Anthropic API key (https://console.anthropic.com)
- A free Stripe account (https://stripe.com) — for payments
- VSCode with these extensions: ESLint, Prettier, Tailwind CSS IntelliSense

---

## 📁 Project Structure

```
careerforge-pro/
├── frontend/          ← React + Vite + Tailwind app
├── backend/           ← Node.js + Express API server
└── README.md
```

---

## ⚡ Quick Start (Run Both Servers)

### Step 1: Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your API keys (see below)
npm run dev
```

### Step 2: Setup Frontend (new terminal)
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Step 3: Open in browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## 🔑 Environment Variables

### backend/.env
```
PORT=3001
ANTHROPIC_API_KEY=sk-ant-your-key-here
STRIPE_SECRET_KEY=sk_test_your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PRO_PRICE_ID=price_your-price-id
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-super-secret-jwt-key-change-this
```

### frontend/.env
```
VITE_API_URL=http://localhost:3001
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
```

---

## 💳 Stripe Setup (Free)
1. Go to https://stripe.com → Create account
2. Dashboard → Products → Add Product → "CareerForge Pro" → $19/month
3. Copy the **Price ID** → paste into `STRIPE_PRO_PRICE_ID`
4. Copy **Publishable Key** and **Secret Key** from Developers → API Keys
5. For webhooks locally: `npx stripe listen --forward-to localhost:3001/api/webhook/stripe`

---

## 🤖 Anthropic API Setup
1. Go to https://console.anthropic.com
2. API Keys → Create Key
3. Paste into `ANTHROPIC_API_KEY`

---

## 📦 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express, Puppeteer |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Payments | Stripe Checkout + Webhooks |
| PDF | Puppeteer (Headless Chrome) |
| Auth | JWT (JSON Web Tokens) |

---

## 🗓️ Week-by-Week Features
- **Week 1**: Resume Builder with live preview (split screen)
- **Week 2**: AI rewriter + ATS scoring
- **Week 3**: PDF export + Stripe payments
- **Week 4**: Cover letter generator + Dashboard   this is readme in folder file but in github showing add readme
