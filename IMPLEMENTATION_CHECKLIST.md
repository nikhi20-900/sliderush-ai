# SlideRush AI — Implementation Checklist (vs context.md Spec)

> Cross-referenced against the full `context.md` specification and the existing codebase.
> **Legend**: ✅ Done | ⚠️ Partial / Stub | ❌ Not Started

---

## 1. Public Pages & Navigation

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | **Landing page (`/`)** — Hero, Features, CTA, Footer | ✅ | `page.tsx`, `hero.tsx`, `feature-highlights.tsx`, `cta-get-started.tsx`, `site-footer.tsx` |
| 2 | **Auth page (`/auth`)** — Email, Google, Phone OTP tabs | ✅ | `auth/page.tsx`, `email-auth-form.tsx`, `google-sign-in-button.tsx`, `phone-otp-form.tsx` |
| 3 | **Pricing page (`/pricing`)** — Plans (Free/Pro/Ultra), FAQs | ✅ | `pricing/page.tsx` with 3 plans and FAQs |
| 4 | **Templates gallery (`/templates`)** — Public preview | ✅ | `templates/page.tsx` exists |
| 5 | **Site Header / Navigation** | ✅ | `site-header.tsx` |

---

## 2. Auth & Session Management

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Firebase Auth init (client SDK) | ✅ | `lib/firebase/client.ts` |
| 2 | Firebase Admin SDK (for API routes) | ✅ | `lib/firebase/admin.ts` |
| 3 | Auth state provider (React context) | ✅ | `components/auth/auth-provider.tsx` |
| 4 | Auth gate (route protection) | ✅ | `components/auth/auth-gate.tsx` |
| 5 | Email/password auth | ✅ | `email-auth-form.tsx` |
| 6 | Google sign-in | ✅ | `google-sign-in-button.tsx` |
| 7 | Phone OTP auth | ✅ | `phone-otp-form.tsx` |
| 8 | Unverified email handling (resend link) | ❌ | No implementation found |
| 9 | Session redirect logic (block editor without session) | ⚠️ | Auth gate exists but no explicit redirect from editor/dashboard |

---

## 3. Dashboard (`/dashboard`)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Dashboard page | ✅ | `dashboard/page.tsx` |
| 2 | Create New Presentation CTA | ✅ | `quick-actions.tsx` |
| 3 | Recent Projects list | ✅ | `recent-projects.tsx`, `project-card.tsx`, `project-list.tsx` |
| 4 | Usage overview (plan + usage bars) | ✅ | `usage-overview.tsx`, `plan-info.tsx` |
| 5 | Project search / sort / filter | ❌ | No search or sort UI found |
| 6 | Project actions: rename, duplicate, delete | ⚠️ | Delete exists via API; rename/duplicate not wired in UI |

---

## 4. Create Wizard (`/create`)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Create wizard page (multi-step) | ✅ | `create/page.tsx`, `create-wizard.tsx` |
| 2 | Step 1: Topic input | ✅ | `topic-input.tsx` |
| 3 | AI topic suggestions ("Suggest topics") | ✅ | `api/ai/suggest-topics/route.ts` + `lib/openai/client.ts` `suggestTopics()` |
| 4 | Step 2: Slide count selector (6–12) | ✅ | `slidecount-selector.tsx` |
| 5 | Step 3: Template selection | ✅ | `template-grid.tsx` |
| 6 | Step 4: Generation progress UI | ✅ | `generation-progress.tsx` |
| 7 | Optional fields: subject, audience, tone | ⚠️ | API supports them; unclear if wizard UI exposes all of them |
| 8 | Color scheme / font pairing options | ❌ | Not exposed in create wizard |
| 9 | Branding (org name + logo, plan-gated) | ❌ | Not implemented in wizard UI |

---

## 5. AI Generation Pipeline

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Pass A: Outline generation (OpenAI) | ✅ | `lib/openai/client.ts` → `generateOutline()` |
| 2 | Pass B: Slide content expansion (OpenAI) | ✅ | `lib/openai/client.ts` → `generateSlideContent()` |
| 3 | Image attachment via Unsplash | ✅ | `lib/unsplash/client.ts` → `searchPhotos()` used in generate route |
| 4 | Generation API route | ✅ | `api/projects/[projectId]/generate/route.ts` |
| 5 | Multi-stage progress tracking (outline → slides → images → finalize) | ⚠️ | Status field exists but progress is not updated per-stage in real time |
| 6 | Cancel generation | ❌ | No cancel endpoint or logic |
| 7 | Retry from failed stage | ❌ | Not implemented |
| 8 | Quota check before generation | ❌ | `checkGenerationQuota()` exists in `lib/usage/quota.ts` but NOT called in generate route |
| 9 | Bad/too-broad topic suggestions | ❌ | No validation or feedback loop |

---

## 6. Slide Editor (`/editor/[projectId]`)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Editor shell (3-panel layout) | ✅ | `editor-shell.tsx` |
| 2 | Slide canvas (main preview) | ✅ | `slide-canvas.tsx` |
| 3 | Slide thumbnails sidebar | ✅ | `slide-thumbnails.tsx` |
| 4 | Slide properties panel | ✅ | `slide-properties.tsx` |
| 5 | Direct text editing (click-to-edit) | ⚠️ | Properties panel allows editing; unclear if inline canvas editing works |
| 6 | Add slide (blank / duplicate / AI-generated) | ⚠️ | `api/projects/[projectId]/slides/route.ts` POST exists; AI-generated slide from prompt not implemented |
| 7 | Delete slide | ✅ | `api/projects/[projectId]/slides/[slideId]/route.ts` DELETE |
| 8 | Reorder via drag & drop (dnd-kit) | ✅ | `api/projects/[projectId]/slides/reorder/route.ts` |
| 9 | Image replace (upload/search) | ❌ | No upload or search UI in editor |
| 10 | Image regeneration | ⚠️ | Route file exists but is **empty stub** (1 line of import) |
| 11 | AI rewrite tools (shorter/longer/simpler/formal) | ⚠️ | API route exists but returns **mock data** — not calling OpenAI; `rewriteSlide()` is fully implemented in `lib/openai/client.ts` but not wired up |
| 12 | "Add speaker notes" via AI | ❌ | Not implemented |
| 13 | Theme change (apply across deck) | ❌ | No theme switcher UI or API |
| 14 | Autosave (debounced) | ⚠️ | Mentioned in `editor-shell.tsx` comments but no debounced save logic found |
| 15 | "Restored draft" notice on refresh | ❌ | Not implemented |
| 16 | Keyboard shortcuts (Ctrl+S, Ctrl+E) | ❌ | Not implemented |

---

## 7. Editor Zustand Store

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | `editor.store.ts` — basic state (project, slides, selectedSlide) | ✅ | Exists but very minimal (3 fields, no actions for add/delete/reorder) |
| 2 | `projects.store.ts` | ✅ | Exists |
| 3 | `auth.store.ts` | ✅ | Exists |
| 4 | Optimistic updates for reorder/edit | ❌ | Not implemented |
| 5 | Add/delete/reorder slide actions in store | ❌ | Store only has `setProject`, `setSlides`, `selectSlide` |

---

## 8. Export & Save

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | PPTX export via PptxGenJS | ✅ | `lib/pptx/build-deck.ts` — 4 templates, multiple layouts, watermark |
| 2 | Export API route (PPTX) | ✅ | `api/projects/[projectId]/export/route.ts` |
| 3 | Upload to Firebase Storage | ✅ | In export route |
| 4 | Watermark for free tier | ✅ | In `build-deck.ts` |
| 5 | Speaker notes in PPTX | ✅ | Implemented |
| 6 | PDF export | ⚠️ | HTML-based PDF (browser print); `lib/pdf/generate.ts` exists. Not true PDF generation |
| 7 | PDF feature gating (Pro+) | ✅ | Export route checks `canAccessFeature('export_pdf')` |
| 8 | Persist export artifacts for re-download | ❌ | Exports collection not written to |
| 9 | Export usage tracking | ✅ | `incrementUsage()` called in export route |
| 10 | Actual image embedding in PPTX | ❌ | Images are text placeholders `[Image: ...]`, not actual embedded images |

---

## 9. Usage Tracking & Quotas

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Plan limits definition (Free/Pro/Ultra) | ✅ | `lib/usage/quota.ts` — `PLAN_LIMITS` |
| 2 | `getUserQuota()` | ✅ | Reads from Firestore `users/{uid}.quota` |
| 3 | `checkGenerationQuota()` | ✅ | Logic exists |
| 4 | `checkExportQuota()` | ✅ | Logic exists |
| 5 | `checkRewriteQuota()` | ✅ | Logic exists |
| 6 | `checkPanicModeQuota()` | ✅ | Logic exists |
| 7 | `incrementUsage()` | ✅ | Increments counters + logs to `usage_events` |
| 8 | Period reset (monthly) | ✅ | In `incrementUsage()` |
| 9 | `getUsageSummary()` (for dashboard) | ✅ | Returns usage bars data |
| 10 | Usage API route (`/api/usage`) | ✅ | `api/usage/route.ts` exists |
| 11 | **Quota enforcement in generate route** | ❌ | `checkGenerationQuota` is NOT called in generate route |
| 12 | **Quota enforcement in rewrite route** | ❌ | Rewrite route is a mock, no quota check |
| 13 | **Quota enforcement in export route** | ⚠️ | Export tracks usage but doesn't CHECK quota before allowing export |

---

## 10. Plan Gating (Feature Restrictions)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Feature gating definitions | ✅ | `lib/features/gating.ts` — 7 features defined |
| 2 | `canAccessFeature()` | ✅ | Checks user plan vs feature requirement |
| 3 | `isTemplatePremium()` | ✅ | Checks against premium template list |
| 4 | Upgrade message helper | ✅ | `getUpgradeMessage()` |
| 5 | Slide count limit by plan | ✅ | `canCreateSlides()` |
| 6 | **Actually gating premium templates in create wizard** | ❌ | Gating logic exists but not integrated into create flow |
| 7 | **Actually gating AI rewrite in editor** | ❌ | Not integrated |
| 8 | **Actually gating image regen in editor** | ❌ | Route is empty stub |
| 9 | **Gating panic mode** | ❌ | No panic mode UI or flow exists |

---

## 11. Panic Mode (Ultra Plan)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Panic mode toggle/button in UI | ❌ | Not implemented |
| 2 | Single-pass faster generation | ❌ | Not implemented |
| 3 | Simpler layouts for speed | ❌ | Not implemented |
| 4 | SLA target: 10–20 seconds | ❌ | Not implemented |

---

## 12. Razorpay Billing

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Razorpay client library (`lib/razorpay/client.ts`) | ❌ | File does not exist |
| 2 | Webhook verification (`lib/razorpay/verify-webhook.ts`) | ❌ | File does not exist |
| 3 | Checkout API route (`/api/billing/checkout`) | ❌ | Not created |
| 4 | Billing status API route (`/api/billing/status`) | ❌ | Not created |
| 5 | Webhook API route (`/api/billing/webhook`) | ❌ | Not created |
| 6 | Subscription management | ❌ | Not implemented |
| 7 | Plan upgrade/downgrade | ❌ | Not implemented |
| 8 | Account page (`/account`) — profile, billing, usage | ❌ | Page does not exist |

---

## 13. Data Model & Firestore

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | `users` collection (with plan, quota) | ✅ | `lib/firebase/users.ts`, used in quota logic |
| 2 | `projects` collection CRUD | ✅ | `api/projects/route.ts`, `api/projects/[projectId]/route.ts` |
| 3 | `slides` subcollection CRUD | ✅ | Routes exist for GET, POST, PATCH, DELETE, reorder |
| 4 | `assets` collection | ❌ | Not implemented (images stored as URLs, not managed assets) |
| 5 | `exports` collection (track exported files) | ❌ | Not implemented |
| 6 | `usage_events` collection | ✅ | Written to by `incrementUsage()` |
| 7 | Firestore security rules | ❌ | No `firestore.rules` file found |
| 8 | Firestore composite indexes | ❌ | No `firestore.indexes.json` found |
| 9 | Soft delete (`deletedAt`) for projects | ❌ | Not implemented |
| 10 | Types for Project | ✅ | `types/project.ts` |
| 11 | Types for Slide | ✅ | `types/slide.ts` |
| 12 | Types for Billing | ❌ | `types/billing.ts` does not exist |
| 13 | Types for API responses | ❌ | `types/api.ts` does not exist |

---

## 14. Templates System

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Template definitions (4 themes) | ✅ | In `build-deck.ts`: modern, corporate, creative, minimal |
| 2 | Template cards in create wizard | ✅ | `template-grid.tsx` |
| 3 | "Tech Startup" template | ❌ | Only 4 of 5 templates from spec exist (missing tech startup) |
| 4 | Layout variations (title, agenda, content+image, two-column, summary, Q&A) | ⚠️ | PPTX builder handles several but not all (no timeline, no dedicated agenda/summary layout) |
| 5 | Color scheme / font pairing selection | ❌ | Not exposed in UI |

---

## 15. Security & Quality

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Project ownership check (`userId`) in API routes | ✅ | Checked in most routes |
| 2 | Rate limiting on AI endpoints | ❌ | Not implemented |
| 3 | Input sanitization | ❌ | No explicit sanitization |
| 4 | Prompt injection resilience | ❌ | No guards against malicious prompts |
| 5 | AI output JSON validation (zod) | ❌ | `lib/openai/schemas.ts` does not exist; raw `JSON.parse()` used |
| 6 | Content safety checks | ❌ | Not implemented |
| 7 | Max character enforcement (per-field) | ❌ | Not enforced server-side |

---

## 16. UX Polish & Performance

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Loading skeletons | ⚠️ | Some loading states exist; unclear if skeleton UI is used throughout |
| 2 | Toast notifications | ⚠️ | `toaster.tsx`, `toast.tsx` exist in `components/ui` |
| 3 | Error boundaries | ❌ | No error boundary components found |
| 4 | Responsive design (mobile review) | ⚠️ | Tailwind responsive classes used but no dedicated mobile optimization |
| 5 | Retry on failure | ❌ | No retry buttons/logic in UI |
| 6 | Multi-tab conflict (last-write-wins + toast) | ❌ | Not implemented |

---

## 17. Environment & Config

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | `.env.local.example` | ✅ | `env.example` exists |
| 2 | Zod env validation (`lib/env.ts`) | ✅ | File exists |
| 3 | `lib/utils.ts` | ✅ | File exists |

---

## 18. Analytics (Future Scope)

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Active users tracking | ❌ | Future scope per spec |
| 2 | Generation/export counts dashboard | ❌ | Future scope |
| 3 | Conversion metrics | ❌ | Future scope |
| 4 | Latency tracking | ❌ | Future scope |

---

## Summary Statistics

| Status | Count |
|--------|-------|
| ✅ Done | ~45 items |
| ⚠️ Partial / Stub | ~15 items |
| ❌ Not Started | ~40 items |

## Recommended Priority Order for Remaining Work

### 🔴 High Priority (Core Functionality Gaps)
1. **Wire up quota enforcement** in generate, rewrite, and export API routes
2. **Implement rewrite API** with real OpenAI calls (logic already exists in `lib/openai/client.ts`)
3. **Implement image regeneration API** (route is empty stub)
4. **Embed actual images in PPTX** (currently text placeholders)
5. **Autosave** with debounce in editor

### 🟡 Medium Priority (Revenue & Business Logic)
6. **Razorpay billing** — checkout, webhooks, subscription management
7. **Account page** (`/account`) — profile, plan, billing history
8. **Plan gating integration** in UI (templates, rewrite, image regen)
9. **Panic Mode** — single-pass generation + UI toggle
10. **Firestore security rules & indexes**

### 🟢 Lower Priority (Polish & Future)
11. **Project search/sort/filter** on dashboard
12. **Theme switcher** in editor
13. **Error boundaries & retry logic**
14. **Keyboard shortcuts**
15. **Rate limiting**
16. **AI output validation with zod schemas**
17. **Version history / snapshots**
18. **Analytics dashboard**
