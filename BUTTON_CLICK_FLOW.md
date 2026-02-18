# Button Click Flow - Accept & Reschedule

## When You Click "Accept" Button on Request Card

### Step 1: Click "Accept" Button
- **Location**: Bottom of the request card (orange gradient button with checkmark icon)
- **Action**: Opens the **Request Action Sheet** from the bottom

### Step 2: Request Action Sheet Opens
**What You See:**
- Bottom sheet slides up
- **Header**: "Review Request"
- **Client Info Card** (gradient background):
  - Large client avatar (64x64px)
  - Client name and service
  - Date & Time (with clock icon)
  - Location (with map pin icon)
  - Duration (if available)
  - Notes (if available)
- **Amount Card** (orange gradient):
  - "Total Amount" label
  - Large amount display (₹XX,XXX)
- **Three Action Buttons**:
  1. ✅ **"Accept & Create Booking"** (large orange button)
  2. 📅 **"Reschedule Time"** (outline button)
  3. ❌ **"Decline Request"** (red outline button)

### Step 3: Click "Accept & Create Booking"
**What Happens:**
1. ✅ Toast notification: "Request accepted! Booking created."
2. ✅ Request Action Sheet closes
3. ✅ Job status changes: `pending` → `scheduled`
4. ✅ Tab automatically switches: "Incoming" → **"Scheduled"**
5. ✅ Job Detail Sheet opens automatically (after 300ms)

### Step 4: Job Detail Sheet Opens
**What You See:**
- Success celebration banner: "🎉 Request Accepted!"
- Job details card with all information
- Amount display
- **"Start Job"** button (large orange button)
- Helper text explaining next steps

### Step 5: Click "Start Job"
**What Happens:**
- Job status changes: `scheduled` → `in_progress`
- Job moves to "Active" tab
- You can now track progress and add expenses

---

## When You Click "Reschedule" Button on Request Card

### Step 1: Click "Reschedule" Button
- **Location**: Bottom of the request card (outline button with calendar icon)
- **Action**: Opens the **Reschedule Sheet** from the bottom

### Step 2: Reschedule Sheet Opens
**What You See:**
- Bottom sheet slides up
- **Header**: "Reschedule Request"
- **Form Fields**:
  - Date picker
  - Time picker
  - Notes field (optional)
- **Action Buttons**:
  - "Save Changes" button
  - "Cancel" button

### Step 3: Update Date/Time
**What Happens:**
1. Select new date
2. Select new time
3. Add notes (optional)
4. Click "Save Changes"
5. Toast notification: "Request rescheduled successfully"
6. Reschedule Sheet closes
7. Request card updates with new date/time

---

## Summary

### Accept Flow:
```
Click "Accept" on Card
  ↓
Request Action Sheet Opens
  ↓
Click "Accept & Create Booking"
  ↓
Tab Switches to "Scheduled"
  ↓
Job Detail Sheet Opens Automatically
  ↓
Click "Start Job"
  ↓
Job Becomes Active
```

### Reschedule Flow:
```
Click "Reschedule" on Card
  ↓
Reschedule Sheet Opens
  ↓
Select New Date/Time
  ↓
Click "Save Changes"
  ↓
Request Updated with New Schedule
```

---

## Visual Flow

### Accept Button:
1. **Card Button** → Opens Review Sheet
2. **Review Sheet** → Shows full details
3. **Accept Button in Sheet** → Accepts request
4. **Auto-Navigation** → Switches to Scheduled tab
5. **Job Details** → Opens automatically
6. **Start Job** → Ready to begin work

### Reschedule Button:
1. **Card Button** → Opens Reschedule Sheet
2. **Reschedule Sheet** → Date/Time picker
3. **Save Changes** → Updates request
4. **Card Updates** → Shows new schedule

---

**Both buttons open bottom sheets for review/action before making changes!**
