# Request Accept Flow - Complete Guide

## What Happens When You Click "Accept & Create Booking"

### Step-by-Step Flow:

1. **Click "Accept & Create Booking" Button**
   - Location: In the `RequestActionSheet` (bottom sheet that opens when you click on a request card)
   - Action: Changes job status from `pending` → `scheduled`

2. **Automatic Actions:**
   - ✅ Toast notification: "Request accepted! Booking created."
   - ✅ Request sheet closes automatically
   - ✅ Tab automatically switches from "Incoming" → "Scheduled"
   - ✅ Job details sheet opens automatically (after 300ms delay for smooth transition)

3. **What You See Next:**
   - **Job Details Sheet** opens from the bottom
   - Shows a **green success message** at the top:
     - "Request Accepted Successfully!"
     - "Your booking is now scheduled. Click 'Start Job' when you're ready to begin work."
   - Displays full job information:
     - Client name and service
     - Date, time, and location
     - Amount (₹)
     - Status badge: "Scheduled"

4. **Next Step - "Start Job" Button:**
   - Large, prominent button with play icon
   - Text: "Start Job"
   - Helper text below: "Next: Start the job when you begin work. You'll be able to track progress and add expenses."
   - When clicked:
     - Status changes: `scheduled` → `in_progress`
     - Job moves to "Active" tab
     - Toast: "Job started! You can now track progress and add expenses."
     - Job execution sheet opens (if configured)

## Complete Request Lifecycle

```
┌─────────────┐
│   Pending   │  ← Incoming Requests Tab
│  (Request)  │
└──────┬──────┘
       │
       │ Click "Accept & Create Booking"
       ▼
┌─────────────┐
│  Scheduled  │  ← Scheduled Tab (Auto-switches here)
│  (Accepted) │     Job Details Sheet Opens
└──────┬──────┘     Shows "Start Job" Button
       │
       │ Click "Start Job"
       ▼
┌─────────────┐
│ In Progress │  ← Active Tab
│  (Started)  │     Job Execution Sheet Opens
└──────┬──────┘     Can track progress, add expenses
       │
       │ Click "Mark Complete"
       ▼
┌─────────────┐
│  Completed  │  ← Completed Tab
│  (Finished) │     Payment prompt appears
└─────────────┘
```

## Visual Flow After Accept

### Immediately After Accept:
1. **RequestActionSheet** closes
2. **Tab switches** to "Scheduled" (animated)
3. **JobDetailSheet** opens (after 300ms)
4. **Success message** appears at top of JobDetailSheet

### In JobDetailSheet:
- ✅ Green success banner (auto-hides after 5 seconds)
- ✅ Full job details displayed
- ✅ "Start Job" button (primary action)
- ✅ Helper text explaining next steps

### After Clicking "Start Job":
- Status changes to "in_progress"
- Job moves to "Active" tab
- JobExecutionSheet opens (if configured)
- Can now:
  - Track work progress
  - Add expenses
  - Add materials
  - Add notes
  - Mark as complete when done

## Key Features

### Automatic Navigation
- ✅ Auto-switches to "Scheduled" tab
- ✅ Auto-opens job details
- ✅ Highlights the accepted job

### Clear Next Steps
- ✅ Success message explains what happened
- ✅ "Start Job" button is prominent
- ✅ Helper text explains what happens next

### User Experience
- ✅ Smooth transitions with delays
- ✅ Toast notifications for feedback
- ✅ Visual status badges
- ✅ Clear workflow indicators

## Code Implementation

### Files Involved:
1. **`RequestActionSheet.tsx`** - Handles accept action
2. **`RequestsPage.tsx`** - Manages tab switching and job selection
3. **`JobDetailSheet.tsx`** - Shows job details and next actions
4. **`AppContext.tsx`** - Updates job status globally

### Key Functions:
- `handleAccept()` - In RequestActionSheet, updates status and calls callback
- `handleRequestAccepted()` - In RequestsPage, switches tab and selects job
- `updateJobStatus()` - In AppContext, updates job status globally

## Summary

**After clicking "Accept & Create Booking":**
1. Request is accepted ✅
2. Tab switches to "Scheduled" ✅
3. Job details open automatically ✅
4. Success message shows ✅
5. "Start Job" button is ready ✅
6. User can start work when ready ✅

The flow is now **automatic and clear** - no manual navigation needed!
