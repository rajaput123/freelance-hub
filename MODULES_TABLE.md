# Freelancer Service Management - Modules & Sub-Modules

## Complete Module Structure

| **Main Module** | **Sub-Module / Section** | **Route** | **Description** |
|----------------|-------------------------|-----------|-----------------|
| **🔐 Authentication** | Login | `/login` | User login with phone number and MPIN |
| | Register | `/register` | New user registration with phone number |
| | OTP Verification | `/otp-verify` | Verify OTP sent to phone number |
| | MPIN Verification | `/mpin-verify` | Verify MPIN for login |
| **📝 Onboarding** | Basic Info | `/onboarding/basic-info` | Name, work category, business name |
| | Service Area | `/onboarding/service-area` | City and coverage area setup |
| | Documents | `/onboarding/documents` | Upload identity and business documents |
| | Profile Setup | `/onboarding/profile` | Profile photo, description, qualifications |
| | Services Setup | `/onboarding/services` | Add services with pricing and categories |
| | MPIN Setup | `/onboarding/mpin` | Set 4-digit MPIN for quick login |
| **🏠 Dashboard** | Home | `/` | Main dashboard with overview and quick actions |
| **📅 Calendar** | Calendar View | `/calendar` | Day/Week/Month views of bookings, tasks, and events |
| **📋 Requests** | Incoming Requests | `/requests` | View and manage incoming service requests |
| | Accept/Reschedule/Decline | - | Actions on requests (via sheets) |
| **📊 Activity** | Activity Feed | `/activity` | Recent activity and updates |
| **👤 Profile** | Profile Management | `/profile` | View and edit profile information |
| | Personal Details | - | Name, contact, business info |
| | Service Area | - | Update city and coverage area |
| | Documents | - | Manage identity and business documents |
| | Quick Links | - | Access to services, finance, settings |
| **📦 More Module** | Events | `/more/events` | List all events and projects |
| | Services | `/more/services` | Service catalog management |
| | Clients | `/more/clients` | Client directory and management |
| | Jobs | `/more/jobs` | All job records and history |
| | Inventory | `/more/inventory` | Stock and materials management |
| | Finance | `/more/finance` | Payments and financial overview |
| | Messages | `/more/communication` | Communication and messages |
| | Reports | `/more/reports` | Analytics and reports |
| **🎉 Events** | Events List | `/more/events` | View all events (weddings, parties, etc.) |
| | Event Dashboard | `/event/:eventId` | Main control center for event |
| | ├─ Overview | - | Event summary, progress, financial overview |
| | ├─ Tasks | - | Task planning with deadlines and status |
| | ├─ Materials | - | Material requirements linked to inventory |
| | ├─ Team | - | Helpers and suppliers management |
| | ├─ Payments | - | Record staged payments from client |
| | ├─ Expenses | - | Track all event expenses (materials, helpers, transport, etc.) |
| | └─ Notes | - | Important notes and information |
| **💰 Finance & Payments** | Overview | `/more/finance` (Overview tab) | Earnings summary, total received vs pending |
| | Pending Dues | `/more/finance` (Pending tab) | List of unpaid/partially paid bookings/events |
| | Transactions | `/more/finance` (Transactions tab) | Full payment history with filters |
| | Expenses | `/more/finance` (Expenses tab) | All expense records |
| **🛍️ Service Catalog** | Services List | `/more/services` | View all services offered |
| | Add Service | - | Add new service with price, duration, category |
| | Edit Service | - | Update existing service details |
| | Delete Service | - | Remove service from catalog |
| **📦 Inventory** | Inventory List | `/more/inventory` | View all materials with quantity and cost |
| | Add Item | - | Add new inventory item with category |
| | Update Stock | - | Manually update quantity |
| | Low Stock Alert | - | Visual indicator for low stock items |
| | Usage History | - | View where materials were used |
| **💬 Communication** | Messages | `/more/communication` | View and manage messages |
| | Unread Count | - | Badge showing unread messages |
| **📈 Reports** | Analytics | `/more/reports` | View reports and analytics |
| **👥 Clients** | Client Directory | `/more/clients` | List all clients |
| | Client Details | - | View client information and history |
| **💼 Jobs** | Jobs List | `/more/jobs` | All job records |
| | Job Details | - | View job information, status, payments |
| | Job Execution | - | Mark job as in-progress, complete |
| **🔍 Other Features** | Search | - | Search functionality across modules |
| | Notifications | - | Notification system (via sidebar) |
| | Settings | - | App settings (via sidebar) |
| | Help & Support | - | Help section (via sidebar) |

## Module Categories

### **Core Navigation Modules** (Bottom Navigation)
1. **Home** - Dashboard
2. **Calendar** - Time management
3. **Requests** - Incoming requests
4. **Activity** - Activity feed
5. **More** - Additional modules

### **Business Management Modules**
- **Events** - Multi-step project management
- **Jobs** - Service bookings
- **Clients** - Client management
- **Services** - Service catalog

### **Resource Management Modules**
- **Inventory** - Materials and stock
- **Finance** - Payments and expenses
- **Calendar** - Scheduling and time blocking

### **Support Modules**
- **Profile** - User profile management
- **Communication** - Messages
- **Reports** - Analytics
- **Settings** - App configuration

## Key Features by Module

### **Events Module**
- ✅ Create events (weddings, parties, corporate events)
- ✅ Task planning with deadlines
- ✅ Material tracking (linked to inventory)
- ✅ Expense tracking (categorized)
- ✅ Payment recording (staged payments)
- ✅ Team management (helpers and suppliers)
- ✅ Progress tracking
- ✅ Financial overview (budget vs actual)

### **Finance Module**
- ✅ Payment recording (full/partial, multiple methods)
- ✅ Pending dues tracking
- ✅ Expense logging
- ✅ Earnings summary (daily/weekly/monthly)
- ✅ Profit calculation
- ✅ Transaction history with filters

### **Inventory Module**
- ✅ Material list with quantity and cost
- ✅ Add/update items
- ✅ Category management
- ✅ Usage tracking (auto-deduct from stock)
- ✅ Low stock alerts
- ✅ Usage history

### **Service Catalog Module**
- ✅ Service list with pricing
- ✅ Add/edit/delete services
- ✅ Category assignment
- ✅ Duration and price management

### **Calendar Module**
- ✅ Day/Week/Month views
- ✅ Time blocking for bookings and events
- ✅ Conflict detection
- ✅ Quick actions (open details, reschedule)
- ✅ Color-coded status indicators

---

**Total Modules**: 15+ Main Modules  
**Total Sub-Modules/Sections**: 40+ Features
