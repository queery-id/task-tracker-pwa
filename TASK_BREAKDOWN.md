# Task Breakdown: Task Tracker PWA

> Setiap task = 1 session = 1 commit. Format acceptance criteria dari `directives/coding.md`.

---

## Epic 1: Foundation & PWA Shell

### Task 1.1: Project scaffolding + PWA manifest + Service Worker
**Agent:** CCT
```
## Task: Setup project structure, manifest.json, service worker, dan index.html shell
## Input: Project Brief (PROJECT_BRIEF.md)
## Done When:
- [x] Folder structure sesuai arsitektur di PROJECT_CONTEXT.md
- [x] manifest.json lengkap (name, icons placeholder, display: standalone, theme_color)
- [x] service-worker.js dengan cache-first strategy untuk static assets
- [x] index.html shell dengan meta tags PWA (viewport, theme-color, manifest link)
- [x] App bisa di-serve via live-server dan "Install" prompt muncul di Chrome/Edge
```
**Status:** ✅ Completed (2026-02-28)

### Task 1.2: Design system — CSS custom properties + base styles
**Agent:** CCT
```
## Task: Buat CSS design system (dark mode, typography, spacing, components)
## Input: UI spec dari conversation + coding.md (vanilla CSS, custom properties)
## Done When:
- [x] css/style.css berisi design tokens (warna, font, spacing, radius)
- [x] Dark mode sebagai default (--color-bg gelap, --color-text terang)
- [x] Base typography (heading, body, small) terdefinisi
- [x] Utility classes minimal: .card, .btn, .btn-primary, .btn-danger, .input
- [x] Responsive breakpoints terdefinisi (mobile: 480px, tablet: 768px, desktop: 1024px)
```
**Status:** ✅ Completed (2026-02-28)
```

---

## Epic 2: Authentication (Login)

### Task 2.1: Halaman Login — UI + PIN auth logic
**Agent:** CCT
```
## Task: Buat halaman login dengan PIN 6 digit
## Input: UI spec halaman login dari conversation
## Done When:
- [x] Halaman login tampil: logo, input PIN 6 digit, tombol masuk, checkbox "tetap login"
- [x] Layout centered vertikal & horizontal, max-width 320px, 100vh tanpa scroll
- [x] Auto-focus ke input PIN saat load
- [x] Submit on Enter berfungsi
- [x] PIN disimpan hashed (SHA-256 via Web Crypto API) di localStorage
- [x] First-time setup: jika belum ada PIN, tampilkan mode "Buat PIN Baru" + konfirmasi
- [x] PIN salah: shake animation + pesan error inline
- [x] "Tetap login": session persist via localStorage flag
- [x] Setelah login sukses, redirect ke dashboard
```
**Status:** ✅ Completed (2026-02-28)

---

## Epic 3: Dashboard Multi-Task

### Task 3.1: Dashboard layout — header + task cards container
**Agent:** CCT
```
## Task: Buat layout dashboard dengan header bar dan container task cards
## Input: UI spec dashboard dari conversation
## Done When:
- [x] Header bar: nama app (kiri), timer countdown placeholder (tengah), tombol logout (kanan)
- [x] Logout berfungsi (clear session, redirect ke login)
- [x] Task cards container: CSS Grid responsive (1/2/3 kolom sesuai jumlah task)
- [x] FAB "Tambah Task" di pojok kanan bawah (fixed position)
- [x] Klik FAB memunculkan input inline untuk nama task baru
- [x] Tampilan kosong (empty state) jika belum ada task: "Belum ada task. Klik + untuk mulai."
```
**Status:** ✅ Completed (2026-02-28)

### Task 3.2: Task Card component + sub-task preview
**Agent:** CCT
```
## Task: Buat komponen task card dengan progress bar dan preview sub-task
## Input: UI spec task card dari conversation + data model
## Done When:
- [x] Task card menampilkan: judul (editable inline), progress bar, badge "x/y selesai"
- [x] Indikator deadline: warna border kiri (merah/kuning/hijau) — set manual per task
- [x] Preview 3 sub-task teratas (checkbox + label, truncated)
- [x] Checkbox sub-task di preview bisa di-toggle langsung
- [x] Progress bar update real-time saat toggle checkbox
- [x] Tombol "Lihat Semua" navigasi ke halaman detail
- [x] Task card bisa dihapus (icon trash, dengan konfirmasi)
- [x] Max 3 task cards — FAB tersembunyi jika sudah 3
```
**Status:** ✅ Completed (2026-02-28)

### Task 3.3: Data layer — CRUD tasks & sub-tasks di localStorage
**Agent:** CCT
```
## Task: Implementasi data layer untuk tasks dan sub-tasks
## Input: Data model definition
## Done When:
- [x] Module js/store.js mengelola CRUD: createTask, updateTask, deleteTask
- [x] Sub-task CRUD: addSubtask, toggleSubtask, deleteSubtask
- [x] Data structure di localStorage:
      {tasks: [{id, title, priority, deadline, subtasks: [{id, label, done}]}]}
- [x] Semua operasi CRUD memicu save ke localStorage
- [x] Load data saat app start (hydrate dari localStorage)
- [x] Export/import fungsi tersedia (JSON download/upload) — bonus
```
**Status:** ✅ Completed (2026-02-28)

---

## Epic 4: Task Detail Page

### Task 4.1: Halaman detail — full sub-task list + CRUD
**Agent:** CCT
```
## Task: Buat halaman detail task dengan full sub-task management
## Input: UI spec halaman detail dari conversation + store.js
## Done When:
- [x] Back button kembali ke dashboard
- [x] Judul task ditampilkan besar, editable inline
- [x] Progress bar + summary "x dari y selesai"
- [x] Full list sub-task: checkbox + label (editable) + delete button
- [x] Sub-task selesai: strikethrough + opacity reduced, grouped di bawah (collapsible)
- [x] Input "Tambah sub-task" sticky di bawah, submit on Enter, auto-focus setelah submit
- [x] Tombol "Tandai Task Selesai" dan "Hapus Task" (dengan konfirmasi) di bawah list
- [x] Semua perubahan persist ke localStorage via store.js
```
**Status:** ✅ Completed (2026-02-28)

---

## Epic 5: Wake-Up Call System

### Task 5.1: Timer countdown + overlay wake-up call
**Agent:** CCT
```
## Task: Implementasi timer 30 menit + fullscreen overlay interupsi
## Input: UI spec wake-up call dari conversation
## Done When:
- [x] Timer 30 menit berjalan di header (format MM:SS countdown)
- [x] Timer strip bar (progress bar tipis) di atas halaman, berkurang seiring waktu
- [x] Saat timer habis: overlay fullscreen muncul (backdrop gelap 80%)
- [x] Overlay card: heading "Cek Fokus", radio button per task aktif, opsi "Saya terdistraksi"
- [x] Tombol "Lanjut Kerja" hanya aktif setelah pilih opsi
- [x] Overlay tidak bisa di-dismiss klik di luar / Escape
- [x] Jika pilih "terdistraksi": pesan motivasi + highlight task yang seharusnya
- [x] Timer reset setelah respons
- [x] Audio notification (short beep) saat overlay muncul
```
**Status:** ✅ Completed (2026-02-28)

### Task 5.2: Notification API + background wake-up
**Agent:** CCT
```
## Task: Integrasikan Notification API agar wake-up call muncul meski app di background
## Input: Task 5.1 selesai, Service Worker dari Task 1.1
## Done When:
- [x] Request notification permission saat pertama kali login
- [x] Jika app di background: push notification "Cek Fokus — sudah 30 menit!"
- [x] Klik notification membawa user kembali ke app + overlay terbuka
- [x] Jika permission ditolak: app tetap berfungsi (overlay muncul saat app di foreground)
- [x] Timer tetap berjalan via setInterval (foreground) — catatan: background timer terbatas di browser
```
**Status:** ✅ Completed (2026-02-28)

---

## Epic 6: PWA Polish & Deploy

### Task 6.1: PWA icons, splash screen, window-controls-overlay
**Agent:** CCT
```
## Task: Finalisasi PWA assets dan konfigurasi always-on-top
## Input: manifest.json dari Task 1.1
## Done When:
- [ ] Icon PNG: 192x192 dan 512x512 (bisa auto-generate dari 1 source)
- [ ] manifest.json update: icons, shortcuts, screenshots (opsional)
- [ ] display_override: ["window-controls-overlay", "standalone"] di manifest
- [ ] CSS titlebar area menggunakan env(titlebar-area-*) untuk WCO
- [ ] Tested: install di Edge Windows 11, always-on-top toggle tersedia
```

### Task 6.2: Deploy ke Coolify + domain setup
**Agent:** CCT
```
## Task: Deploy static site ke Coolify, setup domain tracking.benkdash.my.id
## Input: Build folder lengkap, Coolify MCP access
## Done When:
- [ ] Dockerfile / Nixpacks config untuk static site (nginx)
- [ ] App deployed di Coolify, container running
- [ ] Domain tracking.benkdash.my.id pointing ke Coolify (DNS A record / CNAME)
- [ ] SSL certificate aktif (Let's Encrypt via Coolify)
- [ ] App accessible via https://tracking.benkdash.my.id
- [ ] PWA installable dari domain production
```

---

## Dependency Graph

```
1.1 (scaffolding) ──┬──→ 1.2 (design system)
                    │
                    ├──→ 2.1 (login) ──→ 3.1 (dashboard layout)
                    │                         │
                    │                         ├──→ 3.2 (task card)
                    │                         │         │
                    │                         │         ├──→ 3.3 (data layer)*
                    │                         │         │
                    │                         │         └──→ 4.1 (task detail)
                    │                         │
                    │                         └──→ 5.1 (timer + overlay)
                    │                                      │
                    │                                      └──→ 5.2 (notifications)
                    │
                    └──→ 6.1 (PWA polish) ──→ 6.2 (deploy)

* 3.3 bisa dikerjakan paralel dengan 3.1/3.2, tapi idealnya setelah data model clear
```

## Summary

| Epic | Tasks | Agent | Dependency |
|------|-------|-------|------------|
| 1. Foundation | 1.1, 1.2 | CCT | None |
| 2. Auth | 2.1 | CCT | 1.1, 1.2 |
| 3. Dashboard | 3.1, 3.2, 3.3 | CCT | 2.1 |
| 4. Detail | 4.1 | CCT | 3.2, 3.3 |
| 5. Wake-Up | 5.1, 5.2 | CCT | 3.1 |
| 6. Deploy | 6.1, 6.2 | CCT | All above |

**Total: 10 tasks = ~10 sessions**

---
*Created: 2026-02-28 | Phase 2: Planning & Task Breakdown*
