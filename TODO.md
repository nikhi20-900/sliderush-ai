# TODO: SlideRush AI Implementation

## Completed ✅
1. Landing page with Hero, Features, CTA
2. Authentication (Email, Google, Phone OTP)
3. Dashboard with project list
4. Create wizard (Topic → Slide Count → Template)
5. Slide editor with canvas, thumbnails, properties
6. AI generation API routes
7. Basic API routes for projects and slides

## Task 1: PPTX Export with PptxGenJS ✅ COMPLETED
- Created `/src/lib/pptx/build-deck.ts` with full PPTX generation
- Implemented 4 template themes (modern, corporate, creative, minimal)
- Added support for multiple slide layouts (title, content, image left/right, two-column)
- Integrated watermark for free tier users
- Added speaker notes support
- Updated `/src/app/api/projects/[projectId]/export/route.ts` to:
  - Fetch slides from Firestore
  - Generate PPTX using PptxGenJS
  - Upload to Firebase Storage
  - Return download URL

## Remaining Tasks (Priority Order)

### High Priority
2. **Usage Tracking & Quotas** - Implement plan limits
   - Track generations, exports, rewrites, image regenerations
   - Enforce quotas per plan (free/pro/ultra)
   - Create usage_events collection
   - Add quota checking middleware

3. **Plan Gating** - Feature restrictions based on subscription
   - Gate premium templates
   - Gate AI rewrite tools
   - Gate image regeneration
   - Gate panic mode

### Medium Priority
4. **PDF Export** - Secondary export option
   - Implement PDF generation fallback
   - Handle watermarks for free tier

5. **Panic Mode** - Ultra plan fast generation
   - Implement single-pass generation
   - Add UI toggle for panic mode
   - SLA target: 10-20 seconds

6. **Razorpay Integration** - Billing system
   - Create checkout API
   - Handle webhooks
   - Manage subscription status
   - Enforce plan limits

7. **Analytics Dashboard** - Track usage
   - Active users
   - Generation/export counts
   - Conversion metrics
   - Latency tracking

### Low Priority
8. **Version History** - Restore previous versions
   - Store snapshots periodically
   - UI for version selection
   - Restore functionality

9. **Advanced Editor Features**
   - Multi-tab conflict resolution
   - Offline support
   - Enhanced drag-and-drop

## Current Focus
Starting with: **PPTX Export Implementation**

