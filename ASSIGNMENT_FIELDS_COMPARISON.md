# Assignment Fields Comparison

## Fields from Images (Add Assignment Form) vs Current Requests/Jobs

### 📋 ASSIGNMENT DETAILS Tab

| **Field Name (from Images)** | **Current Job/Request Interface** | **Status** |
|------------------------------|-----------------------------------|------------|
| Freelancer * (required) | ❌ Missing - Currently assumes current user is freelancer | ❌ Not Implemented |
| Event (from Event Module) | ⚠️ `convertedToEventId` exists but not in form | ⚠️ Partial |
| Linked Structure * (required) | ❌ Missing | ❌ Not Implemented |
| Date * (required) | ✅ `date` field exists | ✅ Exists |
| Duration * (required, e.g., "2 days") | ❌ Missing - Only has `time` not duration | ❌ Not Implemented |
| Agreed Payment (₹) * (required) | ✅ `amount` field exists | ✅ Exists |

### 📝 TASK DETAILS Tab

| **Field Name (from Images)** | **Current Job/Request Interface** | **Status** |
|------------------------------|-----------------------------------|------------|
| Task Name (optional, auto-generated) | ❌ Missing - Only has `service` | ❌ Not Implemented |
| Task Description / Notes (optional) | ⚠️ `notes` exists but not separate task description | ⚠️ Partial |

### Current Job Interface Fields:
- ✅ clientId, clientName
- ✅ service
- ✅ date, time
- ✅ location
- ✅ amount
- ✅ notes
- ✅ materials
- ✅ status
- ⚠️ convertedToEventId (exists but not used in form)

### Missing Fields:
1. **Freelancer Selection** - Who the assignment is for
2. **Event Linking** - Link to event from Event Module
3. **Linked Structure** - Some structure/venue reference
4. **Duration** - Duration like "2 days" instead of just time
5. **Task Name** - Separate task name (auto-generated if empty)
6. **Task Description** - Separate from general notes

---

## Recommendations

To match the "Add Assignment" form, we need to:

1. **Add new Assignment interface** or extend Job interface with:
   - `freelancerId` / `freelancerName` (who receives the assignment)
   - `eventId` (link to event, optional)
   - `linkedStructure` (structure/venue reference)
   - `duration` (e.g., "2 days", "1 week")
   - `taskName` (optional, auto-generated)
   - `taskDescription` (separate from notes)

2. **Update AddJobSheet** to include:
   - Freelancer selection dropdown
   - Event selection dropdown (with "Non-event assignment" option)
   - Linked Structure dropdown
   - Duration input field
   - Two tabs: "Assignment Details" and "Task Details"
   - Task Name and Task Description fields in Task Details tab

3. **Auto-generate Task** when assignment is saved (as mentioned in the form)
