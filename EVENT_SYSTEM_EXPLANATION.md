# Event System - Complete Guide

## What is an Event?

An **Event** is a large-scale project that a freelancer manages, such as:
- 🎉 **Weddings** (reception, ceremony, decoration)
- 🎂 **Birthday Parties** (decoration, catering, setup)
- 🎊 **Anniversaries** (venue setup, decoration)
- 🏢 **Corporate Events** (conferences, seminars, exhibitions)
- 🎪 **Festivals** (temporary setups, decorations)
- Any other multi-day or complex projects

## Event Structure

Each event contains:

### 1. **Basic Information**
- **Title**: Name of the event (e.g., "Sharma Wedding Reception")
- **Client**: The person/organization hosting the event
- **Date & End Date**: When the event starts and ends
- **Location**: Venue address
- **Budget**: Total estimated budget for the event
- **Status**: Planning → In Progress → Completed

### 2. **Team & People**
- **Client**: The main contact (already linked)
- **Helpers**: Team members working on the event (e.g., "Suresh - Electrician", "Ravi - Assistant")
- **Suppliers**: External vendors providing materials/services (to be added)

### 3. **Tasks**
- Break down the event into manageable tasks
- Each task has:
  - Title (e.g., "Venue decoration plan")
  - Deadline
  - Completion status
- Progress is tracked automatically

### 4. **Materials & Inventory**
- **Materials Required**: List of items needed for the event
- **Connected to Inventory**: 
  - When you select materials, they're linked to your inventory
  - System automatically deducts from inventory when materials are used
  - Shows cost per material
  - Tracks total material cost

### 5. **Expenses**
- Track all expenses related to the event:
  - **Materials**: Cost of materials purchased
  - **Helpers**: Wages paid to team members
  - **Transport**: Travel and transportation costs
  - **Tools/Equipment**: Rental or purchase costs
  - **Other**: Any other expenses
- Each expense has:
  - Category
  - Description
  - Amount
- Total expenses are calculated automatically

### 6. **Payments**
- Record payments received from the client:
  - **Full Payment**: Complete payment
  - **Partial Payment**: Installments or advance payments
  - **Payment Methods**: Cash, UPI, Bank Transfer
- Track total received vs. budget

### 7. **Financial Summary**
- **Budget**: Total estimated budget
- **Received**: Total payments received
- **Expenses**: Total expenses incurred
- **Profit**: Received - Expenses
- **Remaining Budget**: Budget - Expenses

### 8. **Notes**
- Add important notes, reminders, or special instructions
- Useful for tracking client preferences, special requirements, etc.

## How Everything Connects

```
EVENT CREATION
    ↓
┌─────────────────────────────────────┐
│         EVENT DASHBOARD             │
│  (Control Center for Everything)     │
└─────────────────────────────────────┘
    ↓
    ├─── TASKS ────────────────────────→ Track progress, deadlines
    │
    ├─── MATERIALS ───────────────────→ Connected to INVENTORY
    │       ↓                            - Select from inventory
    │   INVENTORY                          - Auto-deduct stock
    │       ↓                            - Track material costs
    │   COST TRACKING
    │
    ├─── EXPENSES ─────────────────────→ Track all costs
    │       ├── Materials cost
    │       ├── Helper wages
    │       ├── Transport
    │       ├── Tools/Equipment
    │       └── Other expenses
    │
    ├─── PAYMENTS ─────────────────────→ Record client payments
    │       ↓
    │   FINANCE MODULE
    │       ↓
    │   Profit Calculation
    │
    ├─── TEAM/HELPERS ─────────────────→ Manage team members
    │
    ├─── SUPPLIERS ────────────────────→ Invite/manage suppliers (to be added)
    │
    └─── NOTES ────────────────────────→ Important information
```

## Workflow Example: Wedding Event

### Step 1: Create Event
1. Go to **Events** page
2. Click **+** button
3. Fill in:
   - Title: "Sharma Wedding Reception"
   - Client: Select or add "Priya Sharma"
   - Dates: March 15-16, 2026
   - Location: "Grand Palace Hall, Bangalore"
   - Budget: ₹150,000

### Step 2: Plan Tasks
1. Open event dashboard
2. Go to **Tasks** tab
3. Add tasks:
   - "Venue decoration plan" (Due: March 1)
   - "Flower order confirmation" (Due: Feb 28)
   - "Lighting setup design" (Due: March 5)
   - "Final setup" (Due: March 14)

### Step 3: Add Team Members
1. Go to **Overview** tab
2. Add helpers:
   - "Suresh - Electrician"
   - "Ravi - Assistant"
   - "Meera - Decorator"

### Step 4: Plan Materials
1. Go to **Materials** tab
2. Select from inventory:
   - Flowers (assorted) - 200 stems
   - LED lights - 50 pieces
   - Fabric drapes - 30 meters
3. System automatically:
   - Shows available stock
   - Calculates costs
   - Deducts from inventory when used

### Step 5: Track Expenses
1. Go to **Expenses** tab
2. Add expenses as they occur:
   - "Materials: Bought flowers" - ₹15,000
   - "Helpers: Paid Suresh wages" - ₹3,000
   - "Transport: Van rental" - ₹2,000
3. System tracks total expenses

### Step 6: Record Payments
1. Go to **Payments** tab
2. Record payments received:
   - Advance payment: ₹50,000 (UPI)
   - Mid-event payment: ₹30,000 (Cash)
   - Final payment: ₹70,000 (Bank Transfer)

### Step 7: Monitor Progress
- **Overview** tab shows:
  - Task completion progress
  - Financial summary
  - Budget vs. expenses
  - Profit calculation

## Key Connections

### 1. **Inventory ↔ Materials**
- Materials selected for events are linked to your inventory
- When you use materials, inventory stock is automatically reduced
- Material costs are tracked per event

### 2. **Expenses ↔ Finance**
- All event expenses are included in total expenses
- Shown in Finance page → Expenses tab
- Used for profit calculation

### 3. **Payments ↔ Finance**
- Event payments appear in Finance page
- Included in total earnings
- Used for profit calculation

### 4. **Tasks ↔ Progress**
- Task completion drives event progress
- Progress bar shows % completion
- Helps track event readiness

### 5. **Budget ↔ Expenses ↔ Payments**
- Budget: What you planned to spend
- Expenses: What you actually spent
- Payments: What you received
- Profit: Payments - Expenses

## Benefits

1. **Centralized Management**: Everything in one place
2. **Cost Tracking**: Know exactly what you're spending
3. **Profit Awareness**: See if you're making money
4. **Progress Tracking**: Know what's done and what's pending
5. **Inventory Integration**: Materials automatically linked
6. **Financial Overview**: See all events' financial status

## Current Features ✅

- ✅ Create events
- ✅ Add tasks with deadlines
- ✅ Track task completion
- ✅ Add materials (connected to inventory)
- ✅ Track expenses (categorized)
- ✅ Record payments
- ✅ Add notes
- ✅ View financial summary
- ✅ Track helpers/team members

## Upcoming Features 🚧

- 🚧 Invite clients to view event details
- 🚧 Invite suppliers and manage supplier contacts
- 🚧 Supplier quotes and comparisons
- 🚧 Team member assignments to specific tasks
- 🚧 Material requirement planning (before purchase)
