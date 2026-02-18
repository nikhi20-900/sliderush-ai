Users/nikhilchhetri/Desktop/pptmaker/sliderush-ai/docs/FLOW-DIAGRAM.md</path>
<parameter name="content"># SlideRush AI - System Flow Diagrams

## 1. Complete User Journey Flowchart

```
┌─────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                        │
└─────────────────────────────────────────────────────────────┘

  ┌─────────────────┐
  │ User Visits     │
  │ Landing Page    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  Authenticated? │
  └────────┬────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
    YES          NO
     │           │
     ▼           ▼
  ┌─────┐    ┌─────────────────┐
  │Dash-│    │  Auth Hub       │
  │board│    │  - Login/Signup │
  └──┬──┘    │  - Phone OTP    │
     │       │  - Google Sign  │
     │       └────────┬────────┘
     │                │
     │                ▼
     │       ┌─────────────────┐
     │       │  Auth Methods   │
     │       │  - Email/Pass  │
     │       │  - Phone OTP   │
     │       │  - Google      │
     │       └────────┬────────┘
     │                │
     │                ▼
     │       ┌─────────────────┐
     │       │   Dashboard     │
     │       └────────┬────────┘
     │                │
     ▼                ▼
  ┌─────────────────────────────────┐
  │         DASHBOARD               │
  │  ┌─────────────────────────┐   │
  │  │ • Create New Presentation│   │
  │  │ • Browse Templates       │   │
  │  │ • Recent Projects        │   │
  │  │ • Account & Billing      │   │
  │  └─────────────────────────┘   │
  └───────────────┬─────────────────┘
                  │
                  ▼
  ┌─────────────────────────────────┐
  │      CREATE WIZARD              │
  │  ┌─────────────────────────┐   │
  │  │ Step 1: Topic Input     │◄──┐
  │  │ Step 2: Slide Count     │   │
  │  │ Step 3: Template Select │   │
  │  │ Step 4: Generation      │   │
  │  └─────────────────────────┘   │
  └───────────────┬─────────────────┘
                  │
                  ▼
  ┌─────────────────────────────────┐
  │    AI GENERATION PIPELINE      │
  │  ┌─────────────────────────┐   │
  │  │ 1. Generate Outline     │   │
  │  │    (OpenAI GPT-3.5)     │   │
  │  └───────────┬─────────────┘   │
  │              ▼                 │
  │  ┌─────────────────────────┐   │
  │  │ 2. Expand Slide Content │   │
  │  │    (OpenAI GPT-3.5)     │   │
  │  └───────────┬─────────────┘   │
  │              ▼                 │
  │  ┌─────────────────────────┐   │
  │  │ 3. Fetch Images         │   │
  │  │    (Unsplash API)       │   │
  │  └───────────┬─────────────┘   │
  │              ▼                 │
  │  ┌─────────────────────────┐   │
  │  │ 4. Create Slide Objects │   │
  │  └───────────┬─────────────┘   │
  │              │                 │
  └──────────────┼─────────────────┘
                 │
                 ▼
  ┌─────────────────────────────────┐
  │       EDITOR PAGE               │
  │  ┌─────────────────────────┐   │
  │  │ • Slide Canvas          │   │
  │  │ • Thumbnail Rail        │   │
  │  │ • Properties Panel      │   │
  │  │ • AI Rewrite Tools      │   │
  │  │ • Theme Switcher        │   │
  │  └─────────────────────────┘   │
  └───────────────┬─────────────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
  ┌────────────┐    ┌────────────┐
  │ Edit Slides│    │  Export    │
  │ • Text     │    │ • PPTX     │
  │ • Images   │    │ • PDF      │
  │ • Reorder  │    │ • Download │
  │ • AI Tools │    └────────────┘
  └────────────┘
```

## 2. API Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    API ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐
│   Frontend   │         │   Frontend   │
│  (Create)    │         │   (Editor)   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     API ROUTES                             │
├─────────────────────────────────────────────────────────────┤
│                                                            │
│  POST /api/projects          → Create new project          │
│  GET  /api/projects/:id      → Get project details         │
│  POST /api/projects/:id/generate → Start generation        │
│  GET  /api/projects/:id/generate/status → Poll status      │
│  GET  /api/projects/:id/slides → Get all slides            │
│  PATCH /api/projects/:id/slides/:id → Update slide          │
│  POST /api/projects/:id/export → Export to PPTX/PDF       │
│  POST /api/ai/suggest-topics → Get AI topic suggestions    │
│                                                            │
└─────────────────────────────────────────────────────────────┘
                         │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
    ┌─────────┐   ┌─────────┐   ┌─────────┐
    │Firebase │   │ OpenAI  │   │Unsplash │
    │  Auth   │   │  API    │   │   API   │
    └─────────┘   └─────────┘   └─────────┘
         │              │              │
         ▼              ▼              ▼
    ┌─────────────────────────────────────────┐
    │            FIRESTORE DB                 │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐│
    │  │  Users  │  │Projects │  │  Slides ││
    │  └─────────┘  └─────────┘  └─────────┘│
    └─────────────────────────────────────────┘
```

## 3. AI Generation Pipeline (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│              AI GENERATION PIPELINE                         │
└─────────────────────────────────────────────────────────────┘

     ┌──────────────────────────────────┐
     │  User Submits Generation Request │
     └───────────────┬──────────────────┘
                     │
                     ▼
     ┌──────────────────────────────────┐
     │  Get Project from Database        │
     │  (Topic, Slide Count, Template)  │
     └───────────────┬──────────────────┘
                     │
                     ▼
     ┌──────────────────────────────────┐
     │  Check Authentication & Quota    │
     └───────────────┬──────────────────┘
                     │
         ┌───────────┴───────────┐
         ▼                       ▼
    ┌─────────┐            ┌──────────┐
    │  PASS   │            │  FAIL    │
    │  ✓      │            │  ✗       │
    └────┬────┘            └─────┬────┘
         │                       │
         ▼                       ▼
    ┌─────────────┐        ┌─────────────┐
    │   STAGE 1:  │        │Show Upgrade │
    │   Outline   │        │   Prompt    │
    │   Generation│        └─────────────┘
    └──────┬──────┘
           │
           ▼
    ┌──────────────────────────────────┐
    │  Call OpenAI GPT-3.5-turbo       │
    │                                  │
    │  Prompt: "Create a {slideCount}  │
    │  slide presentation outline       │
    │  about {topic}"                  │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │  Parse JSON Response             │
    │  Extract:                        │
    │  • Slide titles                  │
    │  • Key points                    │
    │  • Layout hints                  │
    │  • Image queries                 │
    └───────────────┬──────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌─────────┐        ┌──────────┐
    │ Success │        │  Retry   │
    │  ✓      │        │  (3x)    │
    └────┬────┘        └───────────┘
         │
         ▼
    ┌──────────────────────────────────┐
    │   STAGE 2: Content Expansion     │
    │   Loop through each slide        │
    └───────────────┬──────────────────┘
                   │
         ┌─────────┼─────────┐
         ▼         ▼         ▼
    ┌─────────┐┌─────────┐┌─────────┐
    │ Slide 1 ││ Slide 2 ││ Slide N │
    └────┬────┘└────┬────┘└────┬────┘
         │         │         │
         └─────────┼─────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │  Call OpenAI for Each Slide      │
    │                                  │
    │  Prompt: "Expand this slide:     │
    │  Title: {title}                  │
    │  Points: {points}"              │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │  Parse Content Response          │
    │  Extract:                        │
    │  • Expanded bullets              │
    │  • Speaker notes                 │
    │  • Final layout                  │
    │  • Image query                  │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │   STAGE 3: Image Fetching        │
    │   For slides with image queries   │
    └───────────────┬──────────────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌─────────┐        ┌──────────┐
    │ Fetch   │        │ Skip     │
    │ Images  │        │ (No img) │
    └────┬────┘        └───────────┘
         │
         ▼
    ┌──────────────────────────────────┐
    │  Call Unsplash API               │
    │                                  │
    │  GET /search/photos              │
    │  ?query={imageQuery}             │
    │  &per_page=1                    │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │  Store Image URL & Attribution    │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │   STAGE 4: Create Slide Objects  │
    │                                  │
    │  {                               │
    │    id: uuid,                     │
    │    title: "...",                 │
    │    bullets: [...],               │
    │    imageUrl: "...",              │
    │    layout: "..."                 │
    │  }                               │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │   Save to Database               │
    │   Update project status: ready   │
    └───────────────┬──────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │   Return to Client               │
    │   Redirect to /editor/:id        │
    └──────────────────────────────────┘
```

## 4. Data Model Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                  DATA MODEL RELATIONSHIPS                    │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────┐
    │             USERS               │
    │  ┌───────────────────────────┐  │
    │  │ id: string (PK)           │  │
    │  │ email: string             │  │
    │  │ plan: "free" | "pro"      │  │
    │  │ quota: {                  │  │
    │  │   generationsUsed: int    │  │
    │  │   generationsLimit: int   │  │
    │  │ }                         │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    │ creates
                    ▼
    ┌─────────────────────────────────┐
    │            PROJECTS              │
    │  ┌───────────────────────────┐  │
    │  │ id: string (PK)           │  │
    │  │ userId: string (FK)       │  │
    │  │ title: string             │  │
    │  │ topic: string             │  │
    │  │ slideCount: int (6-12)    │  │
    │  │ templateId: string        │  │
    │  │ status: "draft" | "ready" │  │
    │  │ generationStage: string   │  │
    │  │ generationProgress: int   │  │
    │  │ createdAt: timestamp       │  │
    │  │ updatedAt: timestamp       │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    │ contains
                    ▼
    ┌─────────────────────────────────┐
    │              SLIDES              │
    │  ┌───────────────────────────┐  │
    │  │ id: string (PK)           │  │
    │  │ projectId: string (FK)    │  │
    │  │ order: int                │  │
    │  │ layout: string            │  │
    │  │ title: string             │  │
    │  │ bullets: string[]         │  │
    │  │ speakerNotes: string|null │  │
    │  │ imageUrl: string|null     │  │
    │  │ imageQuery: string|null   │  │
    │  │ createdAt: timestamp      │  │
    │  │ updatedAt: timestamp      │  │
    │  └───────────────────────────┘  │
    └─────────────────────────────────┘

    ┌─────────────────────────────────┐
    │              EXPORTS             │
    │  ┌───────────────────────────┐  │
    │  │ id: string (PK)           │  │
    │  │ projectId: string (FK)    │  │
    │  │ userId: string (FK)       │  │
    │  │ format: "pptx" | "pdf"   │  │
    │  │ downloadUrl: string        │  │
    │  │ watermarked: boolean       │  │
    │  │ createdAt: timestamp      │  │
    │  └───────────────────────────┘  │
    └─────────────────────────────────┘
```

## 5. Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────┘

     ┌─────────────────┐
     │  User Clicks    │
     │  Sign In        │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │  Auth Method    │
     │  Selection      │
     └────────┬────────┘
              │
     ┌────────┼────────┬────────────┐
     ▼        ▼        ▼            ▼
  ┌─────┐ ┌─────┐ ┌─────────┐ ┌─────────┐
  │Email│ │Phone│ │  Google │ │  Other  │
  │ /Pwd│ │ OTP │ │   SSO   │ │  OAuth  │
  └──┬──┘ └──┬──┘ └────┬────┘ └────┬────┘
     │        │          │          │
     │        │          │          │
     ▼        ▼          ▼          ▼
  ┌─────────────────────────────────────────┐
  │         FIREBASE AUTHENTICATION         │
  │  ┌─────────────────────────────────┐   │
  │  │  Verify credentials/token      │   │
  │  │  Create session cookie         │   │
  │  │  Store in localStorage          │   │
  │  └─────────────────────────────────┘   │
  └───────────────────┬─────────────────────┘
                      │
                      ▼
  ┌─────────────────────────────────────────┐
  │         FIRESTORE USER DOC              │
  │  ┌─────────────────────────────────┐   │
  │  │  Check if user doc exists       │   │
  │  │  If not, create new doc         │   │
  │  │  Update lastLogin timestamp     │   │
  │  └─────────────────────────────────┘   │
  └───────────────────┬─────────────────────┘
                      │
                      ▼
  ┌─────────────────────────────────────────┐
  │         UPDATE CLIENT STATE              │
  │  ┌─────────────────────────────────┐   │
  │  │  Set user in Zustand store      │   │
  │  │  Update UI to show logged-in     │   │
  │  │  Redirect to dashboard           │   │
  │  └─────────────────────────────────┘   │
  └─────────────────────────────────────────┘
```

## 6. Export Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    EXPORT PIPELINE                          │
└─────────────────────────────────────────────────────────────┘

              ┌─────────────────────┐
              │  User Clicks Export│
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Check User Plan     │
              │ & Watermark Status  │
              └─────────┬───────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
      ┌─────────────┐     ┌─────────────┐
      │  Free Plan  │     │  Pro Plan   │
      │  ✓ Add      │     │  ✓ Skip     │
      │  Watermark  │     │  Watermark  │
      └──────┬──────┘     └──────┬──────┘
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
              ┌─────────────────────┐
              │  Fetch Project Data │
              │  • Get all slides   │
              │  • Get template    │
              │  • Get theme       │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  Apply Template      │
              │  & Theme Styles      │
              │  • Colors           │
              │  • Fonts            │
              │  • Spacing          │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │  PptxGenJS Generation│
              │  ┌─────────────────┐│
              │  │ Create PPTX     ││
              │  │ • Add title    ││
              │  │ • Add bullets  ││
              │  │ • Insert imgs  ││
              │  │ • Apply styles ││
              │  │ • Add numbers  ││
              │  └─────────────────┘│
              └─────────┬───────────┘
                        │
         ┌──────────────┼──────────────┐
         ▼                              ▼
   ┌─────────────┐              ┌─────────────┐
   │  Success    │              │   Error     │
   │  ✓         │              │   ✗         │
   └──────┬──────┘              └──────┬──────┘
          │                            │
          ▼                            ▼
   ┌─────────────┐              ┌─────────────┐
   │ Save to     │              │  Show Error │
   │ Firebase    │              │  Toast      │
   │ Storage     │              └─────────────┘
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Generate    │
   │ Download    │
   │ URL         │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Trigger     │
   │ Browser     │
   │ Download    │
   └──────┬──────┘
          │
          ▼
   ┌─────────────┐
   │ Update      │
   │ Usage Stats │
   │ & Show      │
   │ Success     │
   │ Toast       │
   └─────────────┘
```

## 7. State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT FLOW                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    ZUSTAND STORES                           │
└─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────┐
    │         AuthStore               │
    │  ┌───────────────────────────┐  │
    │  │ user: User | null         │  │
    │  │ loading: boolean          │  │
    │  │ login(email, pass)        │  │
    │  │ logout()                  │  │
    │  │ setUser(user)             │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    ▼
    ┌─────────────────────────────────┐
    │        ProjectsStore             │
    │  ┌───────────────────────────┐  │
    │  │ projects: Project[]       │  │
    │  │ currentProject: Project   │  │
    │  │ loading: boolean           │  │
    │  │ createProject(data)       │  │
    │  │ updateProject(id, data)   │  │
    │  │ deleteProject(id)         │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    ▼
    ┌─────────────────────────────────┐
    │         EditorStore              │
    │  ┌───────────────────────────┐  │
    │  │ slides: Slide[]          │  │
    │  │ selectedSlide: Slide|null │  │
    │  │ currentTheme: Theme       │  │
    │  │ loading: boolean          │  │
    │  │ updateSlide(id, data)     │  │
    │  │ reorderSlides(ids)        │  │
    │  │ addSlide(slide)           │  │
    │  │ deleteSlide(id)          │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    ▼
    ┌─────────────────────────────────┐
    │        API CALLS                │
    │  ┌───────────────────────────┐  │
    │  │ All CRUD operations       │  │
    │  │ are dispatched through    │  │
    │  │ Zustand actions           │  │
    │  │ followed by Firestore     │  │
    │  │ updates                   │  │
    │  └───────────────────────────┘  │
    └───────────────┬─────────────────┘
                    │
                    ▼
    ┌─────────────────────────────────┐
    │      FIRESTORE DATABASE         │
    │  ┌───────────────────────────┐  │
    │  │ Real-time sync with      │  │
    │  │ onSnapshot listeners     │  │
    │  └───────────────────────────┘  │
    └─────────────────────────────────┘
```

## 8. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  ERROR HANDLING FLOW                         │
└─────────────────────────────────────────────────────────────┘

              ┌─────────────────────┐
              │  Operation Fails    │
              └─────────┬───────────┘
                        │
                        ▼
              ┌─────────────────────┐
              │ Classify Error     │
              └─────────┬───────────┘
                        │
     ┌──────────┬───────┴───────┬──────────┐
     ▼          ▼               ▼          ▼
┌─────────┐┌─────────┐    ┌─────────┐┌─────────┐
│ Auth    ││ Quota   │    │  API    ││Network  │
│ Error   ││ Exceeded │    │ Error   ││ Error   │
└────┬────┘└────┬────┘    └────┬────┘└────┬────┘
     │          │               │          │
     ▼          ▼               ▼          ▼
┌─────────┐┌─────────┐    ┌─────────┐┌─────────┐
│Redirect ││Show     │    │ Log     ││Retry    │
│to Login ││Upgrade  │    │ Error   ││(3x with │
│         ││Prompt   │    │ & Show  ││ backoff)│
└────┬────┘└────┬────┘    │ Toast   │└────┬────┘
     │          │          └────┬────┘     │
     │          │               │          │
     │          │               │    ┌─────┴─────┐
     │          │               │    ▼           ▼
     │          │               │ ┌─────┐    ┌─────┐
     │          │               │ │Retry│    │Max  │
     │          │               │ │     │    │Reached
     │          │               │ │✓    │    │✗    │
     │          │               │ └──┬──┘    └──┬──┘
     │          │               │    │           │
     │          │               │    │           ▼
     │          │               │    │    ┌─────────┐
     │          │               │    │    │ Show    │
     │          │               │    │    │ Final   │
     │          │               │    │    │ Error   │
     │          │               │    │    └─────────┘
     │          │               │    │
     ▼          ▼               ▼    ▼
┌─────────┐┌─────────┐    ┌─────────┐
│User     ││Go to    │    │ User     │
│Logs In  ││Pricing  │    │ Notified │
└─────────┘└─────────┘    └─────────┘
```

## Summary - Key Statistics

```
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT STATISTICS                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Tech Stack:                                                │
│  • Frontend: Next.js 14, React, TypeScript                  │
│  • Styling: Tailwind CSS, shadcn/ui                         │
│  • State: Zustand                                           │
│  • Database: Firebase Firestore                             │
│  • Auth: Firebase Auth (Email, Phone, Google)               │
│  • AI: OpenAI GPT-3.5-turbo                                │
│  • Images: Unsplash API                                     │
│  • Export: PptxGenJS                                        │
│  • Hosting: Vercel                                          │
├─────────────────────────────────────────────────────────────┤
│  User Flows:                                                │
│  • Creation: Topic → Slide Count → Template → Generate → Edit│
│  • Generation: Outline → Content → Images → Ready            │
│  • Export: PPTX / PDF / Download                            │
│  • Auth: Email / Phone / Google → Dashboard                  │
├─────────────────────────────────────────────────────────────┤
│  API Endpoints: 8 main routes                               │
│  Database Collections: Users, Projects, Slides, Exports      │
│  Slide Templates: 4+ (Modern, Pitch, Academic, Creative)   │
│  AI Features: Topic Suggestions, Content, Rewrites          │
└─────────────────────────────────────────────────────────────┘
```

## Quick Reference - Flow Diagrams

### 1. Creation Flow (5 steps)
```
Topic Input → Slide Count → Template → AI Generation → Editor
```

### 2. Generation Pipeline (3 stages)
```
Outline → Content → Images → Ready
```

### 3. Export Flow (3 steps)
```
Select Format → Generate → Download
```

### 4. Auth Flow (3 options)
```
Email/Password → Phone OTP → Google Sign-In
```

### 5. State Flow
```
User Action → Zustand Store → Firestore → Real-time Update
```

---

*Document Version: 1.0*  
*Last Updated: 2024*  
*Project: SlideRush AI - AI Presentation Generator*
