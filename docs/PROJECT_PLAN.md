# BSK Ops — Project Plan

## Roadmap in 15 steps (detailed)

### 1) Project Foundations

**Goal:** Solid tooling/code base.  
**Tasks:**

- Vite + React + TypeScript + Tailwind + React Router
- ESLint + Prettier
- Strict tsconfig (`noImplicitAny`, `strict`)
- Commitlint + Husky (pre-commit: lint & typecheck)
- Initial README + npm scripts  
  **DoD:** `npm run lint` and `tsc --noEmit` green; project runs locally.

### 2) PWA (base)

**Goal:** Installable app and shell in cache.  
**Tasks:**

- Manifest (name, short_name, icons 192/512, display=standalone, orientation=portrait)
- Service Worker (Workbox) with stale-while-revalidate for app-shell
- “Install app” page + suggestion banner (A2HS)
- Update UX: detect new SW, “Update” button (skipWaiting/clientsClaim)  
  **DoD:** Lighthouse PWA ≥ 95; installable on a phone.

### 3) Modeling & Data (offline-first)

**Goal:** Robust schema and local persistence.  
**Tasks:**

- Define types (Task, ChecklistTemplate, ChecklistRun, Summary, Attachment)
- IndexedDB with Dexie: tables, indexes (when, status, updatedAt), migrations v1
- kv (key-value) for UI flags (e.g. saw_banner)  
  **DoD:** Local CRUD with Dexie; data persists after refresh.

### 4) UI Shell & Navigation

**Goal:** Visual structure and mobile navigation.  
**Tasks:**

- AppBar + hamburger menu (☰) with drawer
- Home (cards: Today, Week, Checklists, Summaries, Blocks, Today’s Recurrences)
- Tabs/Bottom bar Today/This week; Online/Offline indicator  
  **DoD:** Smooth navigation; menu links work.

### 5) Tasks — Today (MVP)

**Goal:** Functional daily operation.  
**Tasks:**

- List with search and chips (With time / Blocked / With attachments / Only pending)
- Quick actions: ✓ Done, ⏸ Block (reason), ➜ Week, Delete, 📎 Photo (stub)
- Mark all done + End day (dialog)
- Empty state with CTA “Select from Week”  
  **DoD:** Flow “open → mark → close day” complete locally.

### 6) Tasks — This week (MVP)

**Goal:** Simple weekly planning.  
**Tasks:**

- List with search and filters: Category, Day, ↻ Recurring, Carried over, Status
- Multi-selection → Send to Today; quick action [➜ Today]  
  **DoD:** Morning check-in in 2–3 taps.

### 7) Recurrences & seed

**Goal:** Automatic generation of recurring tasks.  
**Tasks:**

- Patterns: Weekly (Mon–Sun) and Bi-weekly (even/odd)
- Automatic seed on Monday (generate this week’s occurrences)
- Carried over badge  
  **DoD:** Recurrences appear on correct day; marking “Done” removes the current occurrence.

### 8) End of day & Summaries

**Goal:** Clear shift handover.  
**Tasks:**

- Dialog: count Done / Blocked / Pending; daily notes
- Move pending to “This week”; save Summary (refs of attachments)
- Summaries screen (list + detail)  
  **DoD:** Summary saved and visible; next start shows briefing (optional).

### 9) Attachments (photos)

**Goal:** Capture evidence on phone.  
**Tasks:**

- `<input capture="environment" accept="image/*">`
- Light compression; save Blob in IndexedDB; preview on card
- Mark for later upload (linked with outbox)  
  **DoD:** Photo attached offline and persists after restart.

### 10) Sync with backend (Outbox pattern)

**Goal:** Server as source of truth without losing offline changes.  
**Tasks:**

- Outbox (create/update/delete) with updatedAt and origin (clientId)
- Push when online (retry/backoff); incremental Pull (/changes?since)
- Conflicts: last-write-wins + warning
- Upload attachments → final URL  
  **DoD:** Disconnect/reconnect without losing changes; server reflects updates.

### 11) Checklists (Opening/Closing/…)

**Goal:** Quick, standardized routines.  
**Tasks:**

- Templates (Opening, Closing, Cleaning, Receiving)
- Daily run with progress (single tick + note/photo per item)  
  **DoD:** Complete Opening/Closing in a typical shift.

### 12) Help & Information

**Goal:** Onboarding and procedures available offline.  
**Tasks:**

- Quick guide (Today/Week/End of day/Recurrences)
- Internal procedures; contacts (tel/mailto)  
  **DoD:** Concise page available offline.

### 13) Accessibility & Performance

**Goal:** Solid UX for everyone and fast.  
**Tasks:**

- Focus rings, labels/ARIA, contrast
- Perf budget: FCP < 1.5s (mid-range), JS shell < 200KB gzip  
  **DoD:** Lighthouse A11y ≥ 95; metrics within budget.

### 14) Testing & Quality

**Goal:** Confidence in main flows.  
**Tasks:**

- Jest + RTL: utilities (filters/seed), reducers, critical components
- Cypress: “Today → End day”, “Recurrences → Today”, offline (airplane mode)
- GitHub Actions: lint + typecheck + tests  
  **DoD:** CI green; 2 E2E scenarios passing.

### 15) Deploy

**Goal:** Public app with reliable updates.  
**Tasks:**

- Vercel/Netlify (HTTPS), PWA headers, preview deploys
- “Status & Sync” page (debug: queue, IndexedDB space)  
  **DoD:** Installable on a real phone; update works.
