# Request Flow Documentation

## Current Flow When Clicking Request Card or Accept Button

### Scenario 1: Clicking on Request Card
1. **Action**: User clicks anywhere on the request card
2. **What Happens**:
   - `onClick={() => setSelectedRequest(job)}` is triggered
   - `RequestActionSheet` opens from bottom
   - Shows full request details in a modal/sheet
3. **Next Steps Available**:
   - User can see "Accept & Create Booking" button
   - User can see "Reschedule Time" button
   - User can see "Decline Request" button

### Scenario 2: Clicking "Accept" Button on Card
1. **Action**: User clicks "Accept" button directly on the card
2. **What Happens**:
   - `onAccept={() => handleAccept(job)}` is triggered
   - This sets `selectedRequest` and opens the `RequestActionSheet`
   - Same as clicking the card - opens the review sheet
3. **Next Steps**: User still needs to click "Accept & Create Booking" in the sheet

### Scenario 3: Clicking "Accept & Create Booking" in Sheet
1. **Action**: User clicks "Accept & Create Booking" button in RequestActionSheet
2. **What Happens**:
   - `handleAccept()` function is called
   - `updateJobStatus(request.id, "scheduled")` - Changes status from "pending" to "scheduled"
   - Shows toast: "Request accepted! Booking created."
   - Sheet closes
   - Request disappears from "Incoming" tab
   - Request appears in "Scheduled" tab
3. **Current Next Steps**:
   - ❌ No automatic navigation
   - ❌ No confirmation screen
   - ❌ No next action prompt
   - ✅ Request just moves to "Scheduled" tab
   - ✅ User can manually switch to "Scheduled" tab to see it

## Current Status Flow

```
pending → scheduled → in_progress → completed
   ↓         ↓            ↓            ↓
Incoming  Scheduled    Active     Completed
```

## Issues/Improvements Needed

1. **After Accepting**:
   - No clear indication of what to do next
   - User might not know the request moved to "Scheduled" tab
   - No option to immediately start the job or view details

2. **Missing Features**:
   - No success screen after accepting
   - No automatic tab switch to show the accepted request
   - No prompt to start the job immediately
   - No option to add notes or materials right after accepting

## Recommended Next Steps After Accept

1. **Option A: Show Success Screen**
   - After accepting, show a success message
   - Option to "View in Scheduled" or "Start Job Now"

2. **Option B: Auto-Switch Tab**
   - Automatically switch to "Scheduled" tab
   - Highlight the newly accepted request

3. **Option C: Show Job Details**
   - After accepting, automatically open JobDetailSheet
   - Allow user to start job or add details immediately

4. **Option D: Navigate to Job**
   - After accepting, navigate to job details page
   - Show full job management interface
