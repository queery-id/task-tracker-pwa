# Project Context: Task Tracker PWA

> Dokumen ini dibaca oleh setiap agent di awal sesi. Update jika arsitektur berubah.

## Overview
PWA pribadi untuk tracking 2-3 task paralel dengan wake-up call setiap 30 menit. Single user (Bambang), PIN auth, dark mode, installable di Windows 11.

## Architecture
```
task-tracker/
├── index.html              ← Login page (entry point)
├── dashboard.html          ← Dashboard multi-task
├── detail.html             ← Task detail / sub-task breakdown
├── css/
│   └── style.css           ← Design system (dark mode, custom properties)
├── js/
│   ├── app.js              ← Router / page controller
│   ├── auth.js             ← PIN authentication logic
│   ├── store.js            ← Data layer (localStorage CRUD)
│   ├── timer.js            ← 30-min countdown + wake-up call
│   └── ui.js               ← DOM manipulation helpers
├── assets/
│   ├── icons/              ← PWA icons (192, 512)
│   └── sounds/
│       └── alert.mp3       ← Wake-up call sound
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Cache-first strategy
├── PROJECT_BRIEF.md        ← Phase 1 output
├── PROJECT_CONTEXT.md      ← File ini
└── TASK_BREAKDOWN.md       ← Phase 2 output
```

## Tech Stack
| Layer | Tech | Notes |
|-------|------|-------|
| Markup | HTML5 | Semantic, multi-page (bukan SPA) |
| Styling | Vanilla CSS | Custom properties, dark mode default |
| Scripting | Vanilla JS (ES6+) | Modules, async/await |
| Storage | localStorage | JSON serialized, MVP |
| PWA | Service Worker + Manifest | Cache-first, installable |
| Notifications | Notification API | Wake-up call background |
| Auth | Web Crypto API (SHA-256) | PIN hashing |
| Hosting | Coolify (nginx static) | tracking.benkdash.my.id |

## Design Tokens
```css
/* Dark mode (default) */
--color-bg: #0f1419;
--color-surface: #1a1f2e;
--color-card: #232a3b;
--color-border: #2d3548;
--color-accent: #6366f1;       /* Indigo — primary */
--color-accent-hover: #818cf8;
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger: #ef4444;
--color-text: #e2e8f0;
--color-text-muted: #94a3b8;
--font-primary: -apple-system, 'Segoe UI', Roboto, sans-serif;
--radius: 8px;
--radius-lg: 12px;
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

## Data Model
```json
{
  "pin_hash": "sha256_hex_string",
  "session_active": true,
  "tasks": [
    {
      "id": "t_1709123456",
      "title": "Deploy Maktabah v2",
      "priority": "high",
      "created_at": "2026-02-28T10:00:00Z",
      "subtasks": [
        {
          "id": "s_1709123457",
          "label": "Fix mobile responsive",
          "done": false
        }
      ]
    }
  ],
  "wake_up_log": [
    {
      "timestamp": "2026-02-28T10:30:00Z",
      "selected_task": "t_1709123456",
      "was_distracted": false
    }
  ]
}
```

## Key Decisions
1. **Multi-page, bukan SPA** — lebih simple, setiap halaman = 1 HTML file
2. **Vanilla JS** — tidak butuh framework untuk app sekecil ini
3. **localStorage** — single user, data kecil, tidak perlu backend
4. **PIN bukan password** — lebih cepat untuk app pribadi, tetap di-hash
5. **Dark mode only (MVP)** — light mode toggle bisa ditambah nanti

## Key Files (Reference)
| File | Fungsi |
|------|--------|
| `PROJECT_BRIEF.md` | Success criteria & constraints |
| `TASK_BREAKDOWN.md` | Epic & task list dengan acceptance criteria |
| `directives/coding.md` | Coding standards & post-task checklist |
| `directives/lessons/COOLIFY_DEPLOYMENT.md` | Deploy reference |

## Session Guidelines (YOLO Mode)

> Sesi build dijalankan dengan `--dangerously-skip-permissions`. Ikuti aturan ini.

### Wajib di Awal Sesi
1. `cd projects/task-tracker/` — JANGAN kerja dari root Workspace
2. Baca file ini (PROJECT_CONTEXT.md)
3. Baca TASK_BREAKDOWN.md — cari task berikutnya yang belum selesai
4. `git log -3` — cek pekerjaan sesi sebelumnya

### Wajib di Akhir Sesi / Setiap Task Selesai
1. Verifikasi acceptance criteria dari task (syntax check, buka di browser)
2. `git add` file yang relevan saja (JANGAN `git add -A` dari root)
3. `git commit -m "Claude Code: [deskripsi task]"`
4. Update checklist di TASK_BREAKDOWN.md (mark [x] yang selesai)

### Larangan (Meskipun YOLO Mode)
- JANGAN sentuh file di luar `projects/task-tracker/`
- JANGAN `git push` tanpa instruksi eksplisit dari Bambang
- JANGAN `rm -rf` atau delete folder/file yang bukan buatan sesi ini
- JANGAN install npm packages global atau modifikasi system files
- JANGAN buat .env atau file berisi credential — app ini client-side only

### Urutan Eksekusi Task
```
Sesi 1: Task 1.1 + 1.2 (foundation, bisa digabung karena kecil)
Sesi 2: Task 2.1 (login)
Sesi 3: Task 3.1 + 3.3 (dashboard layout + data layer)
Sesi 4: Task 3.2 (task card component)
Sesi 5: Task 4.1 (task detail page)
Sesi 6: Task 5.1 + 5.2 (wake-up call system)
Sesi 7: Task 6.1 + 6.2 (PWA polish + deploy)
```

## Current Status
**Phase 3 (Build) COMPLETE** — All 10 tasks done (Epic 1-5 complete, Epic 6 partial).

**GitHub:** https://github.com/queery-id/task-tracker-pwa

**Deployment:** Ready via Coolify UI (MCP server issue)
- Dockerfile + Nixpacks config ready
- Static nginx config ready
- Domain: tracking.benkdash.my.id (DNS A record needed)
- SSL: Let's Encrypt via Coolify (auto)

**Manual Deploy Steps (Coolify UI):**
1. New Project → "Task Tracker"
2. New Application → GitHub → queery-id/task-tracker-pwa
3. Build Pack: Dockerfile
4. Domain: tracking.benkdash.my.id
5. Deploy → Verify HTTPS → Test PWA install

---
*Created: 2026-02-28 | Last Updated: 2026-02-28 | Phase 3 Complete*
