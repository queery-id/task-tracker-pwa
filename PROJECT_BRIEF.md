# Project Brief: Task Tracker PWA

## Problem
Bambang sering mengerjakan 2-3 tugas paralel dengan deadline mendesak, namun mudah terdistraksi dan kehilangan konteks task mana yang seharusnya dikerjakan. Tidak ada tool sederhana yang secara aktif mengingatkan untuk tetap fokus setiap interval tertentu.

## Solution
PWA "Task Tracker" — aplikasi ringan yang:
1. Menampilkan 2-3 task utama secara paralel di satu dashboard
2. Setiap task punya breakdown sub-task yang bisa di-checklist
3. Wake-up call setiap 30 menit memaksa user mengkonfirmasi sedang mengerjakan task yang mana
4. Installable di Windows 11 sebagai PWA dengan opsi always-on-top

## Constraints
- **Stack:** Vanilla HTML/CSS/JS (PWA) — tanpa framework, sesuai coding.md
- **Styling:** Vanilla CSS dengan custom properties, dark mode default
- **Data:** localStorage (MVP), IndexedDB jika > 100 sub-task items
- **Auth:** PIN 6 digit (single user, bukan multi-tenant)
- **Hosting:** Coolify (Docker static site) di domain `tracking.benkdash.my.id`
- **Timeline:** Target 1 minggu (7 sesi agent)
- **Target User:** Bambang (pribadi, 1 user)
- **PWA Requirements:** Service Worker, Web App Manifest, Notification API
- **Browser:** Chromium-based (Edge/Chrome) di Windows 11

## Success Criteria
- [ ] App bisa diinstall sebagai PWA di Windows 11 (Edge/Chrome)
- [ ] Login dengan PIN 6 digit berfungsi (PIN disimpan hashed di localStorage)
- [ ] Dashboard menampilkan 2-3 task card secara paralel (responsive layout)
- [ ] Setiap task card punya sub-task list dengan checkbox yang bisa di-toggle
- [ ] Progress bar per task update otomatis berdasarkan sub-task completion
- [ ] Wake-up call muncul setiap 30 menit sebagai fullscreen overlay + notifikasi
- [ ] Wake-up call tidak bisa di-dismiss tanpa memilih task yang sedang dikerjakan
- [ ] Data (tasks, sub-tasks, PIN) persisten di localStorage
- [ ] App live dan accessible di `tracking.benkdash.my.id` via HTTPS
- [ ] Always-on-top berfungsi via PWA window-controls-overlay (Chromium)

---
*Created: 2026-02-28 | Phase 1: Ideation & Scope Locking*
