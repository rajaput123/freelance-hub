# UI Flow - Screen by Screen: When Clicking "Accept"

## Complete UI Flow Step-by-Step

### **SCREEN 1: Requests Page - Incoming Tab**
**Location**: `/requests` page, "Incoming" tab

**What User Sees**:
- Page header: "Requests & Bookings"
- Tab switcher: [Incoming] | Scheduled | Active | Completed
- Workflow indicator: Request → Accept → Execute → Complete
- List of request cards (pending requests)

**Request Card Shows**:
- Client avatar (gradient circle with initial)
- Client name
- Service name
- Date & time
- Location
- Amount (₹)
- Status badge: "New"
- **Three action buttons**:
  - ✅ **"Accept"** (green gradient button)
  - 📅 "Reschedule" (outline button)
  - ❌ "Decline" (red icon button)

**User Action**: Clicks **"Accept"** button on the card

---

### **SCREEN 2: Request Action Sheet (Bottom Sheet)**
**Component**: `RequestActionSheet`
**Opens**: From bottom of screen (slide up animation)

**What User Sees**:
- Drag handle (small gray bar at top)
- Header: "Review Request"
- **Request Details Card**:
  - Large client avatar
  - Client name
  - Service name
  - Date & time with clock icon
  - Duration (if available)
  - Location with map pin icon
  - Notes/description (if available)
  - Amount section: ₹XX,XXX
- **Three Action Buttons**:
  1. ✅ **"Accept & Create Booking"** (primary gradient button)
  2. 📅 "Reschedule Time" (outline button)
  3. ❌ "Decline Request" (outline red button)

**User Action**: Clicks **"Accept & Create Booking"** button

**What Happens**:
- Toast notification appears: "Request accepted! Booking created."
- RequestActionSheet closes (slides down)
- Job status changes: `pending` → `scheduled`

---

### **SCREEN 3: Requests Page - Scheduled Tab (Auto-Switched)**
**Location**: Same `/requests` page, but tab automatically switches

**What User Sees**:
- Tab switcher: Incoming | **[Scheduled]** | Active | Completed
  - "Scheduled" tab is now highlighted
- Workflow indicator: Request → **Accept** → Execute → Complete
  - "Accept" step is now highlighted
- List of scheduled job cards (including the newly accepted one)

**Job Card Shows**:
- Client avatar
- Client name
- Service name
- Time
- Location
- Amount
- Status badge: "Scheduled"
- Payment status (if any)

**Automatic Action**: After 300ms delay, **JobDetailSheet opens automatically**

---

### **SCREEN 4: Job Detail Sheet (Bottom Sheet)**
**Component**: `JobDetailSheet`
**Opens**: Automatically from bottom (slide up animation)

**What User Sees**:
- Drag handle
- Header: Service name + "Scheduled" badge
- **✅ Success Message Banner** (green, auto-hides after 5 seconds):
  - CheckCircle icon
  - "Request Accepted Successfully!"
  - "Your booking is now scheduled. Click 'Start Job' when you're ready to begin work."
- **Job Information Card**:
  - Client avatar
  - Client name
  - Service name
  - Date & time (with clock icon)
  - Location (with map pin icon)
  - Notes (if any)
- **Amount Display** (gradient primary background):
  - "AMOUNT" label
  - ₹XX,XXX (large, bold)
- **Primary Action Button**:
  - ▶️ **"Start Job"** (large gradient primary button)
- **Helper Text** (below button):
  - "Next: Start the job when you begin work. You'll be able to track progress and add expenses."

**User Action**: Clicks **"Start Job"** button

**What Happens**:
- Toast notification: "Job started! You can now track progress and add expenses."
- JobDetailSheet closes
- Job status changes: `scheduled` → `in_progress`
- Job moves to "Active" tab

---

### **SCREEN 5: Requests Page - Active Tab (If User Navigates)**
**Location**: `/requests` page, "Active" tab

**What User Sees**:
- Tab switcher: Incoming | Scheduled | **[Active]** | Completed
- Workflow indicator: Request → Accept → **Execute** → Complete
  - "Execute" step is now highlighted
- List of active job cards

**Job Card Shows**:
- Same as scheduled card, but:
- Status badge: "Active"
- When clicked, opens **JobExecutionSheet** (for tracking work)

---

### **SCREEN 6: Job Execution Sheet (Optional - When Job is Active)**
**Component**: `JobExecutionSheet`
**Opens**: When user clicks on an active job card

**What User Sees**:
- Job details
- Progress tracking options
- Expense tracking
- Material tracking
- **"Mark Complete"** button

**User Action**: Clicks "Mark Complete"

**What Happens**:
- Job status changes: `in_progress` → `completed`
- Job moves to "Completed" tab
- Payment prompt may appear

---

## Visual Flow Diagram

```
┌─────────────────────────────────────┐
│  SCREEN 1: Incoming Tab            │
│  ┌─────────────────────────────┐  │
│  │ Request Card                │  │
│  │ [Accept] [Reschedule] [X]  │  │
│  └─────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Click "Accept"
               ▼
┌─────────────────────────────────────┐
│  SCREEN 2: Request Action Sheet     │
│  ┌─────────────────────────────┐  │
│  │ Review Request              │  │
│  │ [Accept & Create Booking]  │  │
│  │ [Reschedule Time]          │  │
│  │ [Decline Request]          │  │
│  └─────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Click "Accept & Create Booking"
               ▼
┌─────────────────────────────────────┐
│  SCREEN 3: Scheduled Tab (Auto)     │
│  ┌─────────────────────────────┐  │
│  │ Job Card (Scheduled)          │  │
│  └─────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Auto-opens after 300ms
               ▼
┌─────────────────────────────────────┐
│  SCREEN 4: Job Detail Sheet         │
│  ┌─────────────────────────────┐  │
│  │ ✅ Success Message           │  │
│  │ Job Details                  │  │
│  │ Amount: ₹XX,XXX             │  │
│  │ [▶️ Start Job]               │  │
│  └─────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ Click "Start Job"
               ▼
┌─────────────────────────────────────┐
│  SCREEN 5: Active Tab                │
│  ┌─────────────────────────────┐  │
│  │ Job Card (Active)            │  │
│  └─────────────────────────────┘  │
└─────────────────────────────────────┘
```

## Summary of Screens

1. **Requests Page - Incoming Tab** → User clicks "Accept"
2. **Request Action Sheet** → User clicks "Accept & Create Booking"
3. **Requests Page - Scheduled Tab** (auto-switched) → JobDetailSheet auto-opens
4. **Job Detail Sheet** → Shows success message + "Start Job" button
5. **User clicks "Start Job"** → Job becomes active
6. **Requests Page - Active Tab** (optional navigation)
7. **Job Execution Sheet** (optional - for active jobs)

## Key UI Features

### Automatic Actions:
- ✅ Tab switches automatically to "Scheduled"
- ✅ JobDetailSheet opens automatically
- ✅ Success message appears and auto-hides

### User Actions:
- Click "Accept" on card
- Click "Accept & Create Booking" in sheet
- Click "Start Job" in job details
- (Optional) Track progress in execution sheet

## Status Flow

```
pending → scheduled → in_progress → completed
   ↓         ↓            ↓            ↓
Incoming  Scheduled    Active     Completed
```

## Time Delays

- **100ms**: Delay before tab switch (to avoid hooks issues)
- **300ms**: Delay before JobDetailSheet opens (for smooth animation)
- **5000ms**: Success message auto-hides

---

**This is the complete UI flow when clicking "Accept" on a request!**
