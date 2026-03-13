# Platform Documentation — Complete Product Specification

> **Last Updated:** 8 March 2026
> **Stack:** React + Vite + TypeScript + Tailwind CSS + Lovable Cloud (Supabase)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Authentication & Onboarding](#2-authentication--onboarding)
3. [Role System & Navigation](#3-role-system--navigation)
4. [Customer Flow](#4-customer-flow)
5. [Trader / Agency Flow](#5-trader--agency-flow)
6. [Shared Features](#6-shared-features)
7. [Database Schema & Security](#7-database-schema--security)
8. [Component Architecture](#8-component-architecture)
9. [Design System](#9-design-system)
10. [Appendix: Route Map](#appendix-route-map)

---

## 1. Overview

A mobile-first marketplace connecting **Customers** with **Traders** (individual tradespeople or agencies/companies). The platform supports:

- Service discovery, booking, and payment for customers
- Job intake, crew management, earnings tracking, and payroll for traders
- Agency/company workflows with group management, worker profiles, and automated payouts

The app renders role-specific experiences from a single codebase using a `RoleBasedHome` component that checks `profile.role`.

### 1.1 Service Classification

| Category | Label | Description |
|---|---|---|
| **Cat A** | Quick Fix / Fixed Price | Standard jobs with predefined pricing (e.g., tap repair, light switch replacement) |
| **Cat B** | Quote / Project | Complex jobs requiring a detailed quote from the trader (e.g., bathroom renovation) |

---

## 2. Authentication & Onboarding

### 2.1 Authentication Pages

| Route | Page | Description |
|---|---|---|
| `/welcome` | Splash | Landing/welcome screen with sign-in/sign-up CTAs |
| `/auth/signup` | SignUp | Email + password registration |
| `/auth/signin` | SignIn | Email + password login |
| `/auth/forgot-password` | ForgotPassword | Password reset request |
| `/reset-password` | ResetPassword | Token-based password reset |

- **Email verification is required** before sign-in (auto-confirm is NOT enabled).
- Session management is handled via `AuthContext` which wraps the entire app.

### 2.2 Onboarding Flow

Onboarding is **role-based** and tracked via `profiles.onboarding_status`:

| Status | Route | Step |
|---|---|---|
| `role_selection` | `/onboarding/role` | Choose Customer or Trader |
| `profile_setup` (customer) | `/onboarding/profile` | Name, phone, avatar upload |
| `profile_setup` (trader) | `/onboarding/trader-profile` | Multi-step trader setup |
| `completed` | `/` | Redirects to role-based home |

#### Trader Onboarding Steps (4 stages):
1. **Type Selection** — Choose between "Individual" or "Agency/Company"
2. **Business Details** — Company name, address, registration info
3. **Service Selection** — Hierarchical category picker with expandable parent categories containing nested sub-services (Cat A = fixed-price quick jobs, Cat B = quote-based projects)
4. **Document Verification** — Mandatory uploads for:
   - Government-issued ID
   - Proof of address
   - Trade qualifications / certifications
   - Public liability insurance
   - Company registration (agencies only)

The `ProtectedRoute` wrapper automatically redirects users to the correct onboarding step if incomplete.

---

## 3. Role System & Navigation

### 3.1 Roles

Roles are stored in a **separate `user_roles` table** (not on the profiles table) to prevent privilege escalation:

- `customer` — End-user booking services
- `trader` — Individual tradesperson or agency owner

A `has_role()` security-definer function is used in RLS policies to check roles without recursion.

### 3.2 Trader Types

| Type | Description |
|---|---|
| `individual` | Solo tradesperson who accepts and completes jobs themselves |
| `agency` | Company/agency owner who manages groups of workers and assigns jobs |

The `trader_type` field on profiles determines which UI variant a trader sees across all screens.

### 3.3 Navigation (Bottom Nav)

**Customer Navigation:**
| Tab | Route | Icon |
|---|---|---|
| Home | `/` | Home |
| Services | `/services` | Grid |
| Bookings | `/bookings` | Calendar |
| Chat | `/chat` | MessageCircle |
| Profile | `/profile` | User |

**Trader Navigation:**
| Tab | Route | Icon |
|---|---|---|
| Home | `/` | Home |
| Jobs | `/trader/jobs` | Briefcase |
| Groups | `/trader/groups` | Users |
| Profile | `/profile` | User |

> **Key difference:** Traders get "Groups" instead of "Chat" to support agency management.

### 3.4 Profile Menu (Role-Specific Items)

**Trader-exclusive:**
- Earnings history (`/trader/earnings`)
- Payout methods — Bank/IBAN (`/profile/payouts`)
- Company & Tax info (`/profile/tax`)
- Groups / Team management (`/trader/groups`)

**Customer-exclusive:**
- Saved Traders (`/profile/favourites`)
- Payment Methods (`/profile/payments`)

**Shared:**
- My Details, Address, Security, Notifications, Language, Help, Feedback, Legal, Verification

---

## 4. Customer Flow

### 4.1 Home Page (`/` for customers — `Index.tsx`)

- **Header:** Location bar (tappable, navigates to address management) + notification bell
- **Search Bar:** Full-text search navigating to `/search`
- **Category Chips:** Horizontal scroll of service categories
- **Hero Banner:** Promotional banner with CTA
- **Service Bundles:** Curated package deals (e.g., "Move-in Bundle")
- **Service Tabs:** Toggle between Cat A (quick fixes) and Cat B (projects)
- **Provider List:** Top-rated traders with star ratings, distance, availability
- **Saved Traders List:** Quick access to bookmarked traders

### 4.2 Service Discovery

| Route | Component | Purpose |
|---|---|---|
| `/services` | Services | Full category grid with search |
| `/categories` | Categories | Browse all categories |
| `/categories/:id` | CategoryDetail | Services within a category |
| `/services/:id` | ServiceDetail | Individual service details, pricing, reviews |
| `/bundles/:id` | BundleDetail | Multi-service package details |
| `/search` | Search | Full-text search with filters |

### 4.3 Booking Flow (`/services/:id/book` — `BookService.tsx`)

Multi-step booking process (5 steps):

1. **Trader Selection** — Choose a specific trader or auto-assign
   - Search from available traders with ratings, distance, availability
   - "Auto-assign" option picks the best available match
2. **Date & Time** — Select date (next 14 days grid) + time slot (09:00–17:00)
3. **Address** — Select from saved addresses or enter new address (street, city, postcode)
4. **Notes & Voice** — Optional text notes + voice note recorder for job description
5. **Payment & Review** — Select payment method, review booking summary with 21% BTW (VAT) calculation, confirm

**Price Breakdown:**
- Service base price
- BTW (21% VAT)
- Total amount

**Cancellation Policy:**
- Customers can cancel bookings with a **mandatory text-based reason**
- Cancellation reason is recorded and displayed in trader/agency management portals

### 4.4 Job Management

| Route | Component | Purpose |
|---|---|---|
| `/jobs` | MyJobs | View active and past jobs |
| `/jobs/post` | PostJob | Post a custom job request |
| `/bookings` | Bookings | View booking history |

### 4.5 Trader Profiles (Customer View)

| Route | Component | Purpose |
|---|---|---|
| `/traders/:id` | TraderProfile | Public profile with reviews, portfolio |
| `/traders/:id/services` | TraderServices | Services offered by a specific trader |

### 4.6 Location Management

- Customers can manage **multiple labeled addresses** (Home, Office, etc.)
- Managed via `/profile/address`
- Default address displayed in home page header as a location bar

---

## 5. Trader / Agency Flow

### 5.1 Trader Home Page (`/` for traders — `TraderHome.tsx`)

**Header Section:**
- Name greeting (e.g., "John 👋")
- Location display below name (tappable → `/profile/address`)
- Chat + Notification buttons (with unread badge)

**Earnings Summary Card:**
- This Week revenue with % change vs last week
- Star rating + review count
- Quick stats: Completed jobs, Pending jobs, This Month total

**Incoming Jobs Section:**
- Vertical list of `IncomingJobCard` components
- Each card shows: title, icon, customer, location, distance, time window, urgency badge
- Actions: Accept (triggers assign flow for agency) or Decline
- Cat B jobs trigger the **Agency Quote Flow** (for agencies) or inline Quote Breakdown (for individuals)
- Voice note indicator with playback
- "View all" links to `/trader/jobs`

**Today's Schedule Section:**
- **Toggle between Card View and Calendar View** (icon buttons)
- **Card View:** Vertical stack of `ActiveJobCard` components
  - First card marked as "Up Next" with gradient banner
  - **Crew arrival progress** (X/Y arrived + progress bar) — **only shown if the job starts within ±2 hours of current time**
  - Jobs beyond the 2-hour window hide crew status to reduce noise
  - All cards show: Message Team + Remind buttons
- **Calendar View:** Hourly timeline (07:00–18:00) with jobs placed at their start time slots

**Earnings + Chart Card (Bottom):**
- Combined card with earnings summary (£ amount + % trend)
- Inline area chart (green gradient)
- "View more" CTA → navigates to `/trader/earnings`

### 5.2 Job Management (`/trader/jobs` — `TraderJobs.tsx`)

Three-tab interface with vertical scrollable card list:

#### Incoming Tab
- Uses `IncomingJobCard` component in a vertical scrollable list
- Expandable cards with full job details including:
  - Customer name, location, distance
  - Job description
  - Customer request metadata (expected duration, budget, photos)
  - Voice note playback
- **Cat A jobs (Fixed Price):**
  - Individual traders: "Pickup" button → directly accepts job
  - Agency traders: "Pickup" button → triggers Accept & Assign modal
- **Cat B jobs (Quote):**
  - Individual traders: "Send Estimate" button → expands inline `QuoteBreakdown`
  - Agency traders: "Send Estimate" button → **replaces the card inline** with the `CollaborativeQuote` flow (see §5.4)
- Company-assigned jobs section (individual workers only) with `CompanyJobCard`

#### Active Tab
- **"Upcoming" section header** with job count badge
- Uses `ActiveJobCard` component
- Every card shows: **Message Team** + **Remind** buttons
- Expandable crew details with individual member statuses
- Crew member statuses: En Route → Arrived → Working → Done

#### Completed Tab
- **Collapsed view** shows: title, location, time, and **assignment badge**:
  - Group assignment: Shows group name + member count (e.g., "Plumbing Squad · 2 members")
  - Individual assignment: Shows person's name
  - Multi-person: Shows first 2 names + overflow (e.g., "Manu, Lena +2")
- **Expanded view** reveals full details:
  - Customer name and location
  - Completion date and total duration
  - Job description
  - **Assignment breakdown**: Each assigned member with:
    - Avatar (boring-avatars, beam variant)
    - Name and role
    - Hours worked
    - Earnings amount
  - Group name badge (for group assignments)
- Footer: Star rating from customer + total price

### 5.3 Accept & Assign Flow (Cat A — Agency Only)

When an agency trader accepts a Cat A (fixed price) job, a bottom-sheet modal walks through:

1. **Choose Assignment Type:**
   - Assign to a Group (select from existing groups)
   - Assign to Individuals (multi-select search from worker pool)

2. **Select Members** (if group selected):
   - Shows all group members with checkboxes (all pre-selected)
   - Toggle individual members on/off

3. **Confirm:**
   - Summary showing job info + selected assignees with avatars
   - Confirm button triggers acceptance + toast notification with names

### 5.4 Agency Quote Flow (Cat B — `CollaborativeQuote` Component)

**This is the core quoting mechanism for agencies on Cat B (quote-type) jobs.** When an agency clicks "Send Estimate" on a Cat B job, the card is **replaced inline** with a multi-step flow:

#### Step 1: Choose Assignment
- **Assign to a Group:** Select from existing groups → proceeds to member review
- **Assign to Individuals:** Multi-select search with chip tags → proceeds to confirm

#### Step 2: Review Group Members (if group selected)
- Shows all members in the selected group with checkboxes
- Group name + selected count displayed in a header badge
- All members pre-selected; agency can deselect specific members
- Back/Continue navigation

#### Step 3: Confirm Assignment & Request Estimates
- Summary of all assigned workers with "Will estimate" badge per worker
- Group name badge (if group assignment)
- Info banner explaining: workers will receive a notification to submit item estimates
- **"Assign & Request"** button sends the estimation request

#### Step 4: Waiting State
- Animated loading with worker avatar stack
- Pulse progress bar
- "Collecting estimates…" message with worker count

#### Step 5: Review & Send Quote to Customer
This is where the agency finalizes the quote. The review screen has four sections:

**A. Average Estimate Banner:**
- Shows the calculated average across all worker submissions (e.g., "Average worker estimate: £85.25 (2 submissions)")

**B. Worker Item Estimates (expandable):**
- Each worker's submission shown as a collapsible card
- Collapsed: Avatar + name + role + item count + total amount
- Expanded: Full itemized list with quantities, unit prices, and subtotals
- Agency can compare individual submissions

**C. Final Materials (Averaged & Editable):**
- System automatically **averages** all worker estimates:
  - Same items across workers → averaged quantity and unit price
  - Unique items → included as-is
- Agency can edit descriptions, quantities, unit prices
- Add/remove material line items
- Each item shows: description, qty, unit price, subtotal

**D. Labour Requirements (Type + Quantity Only):**
- Agency adds labour type (e.g., "Plumber", "Electrician", "Helper")
- Agency sets **quantity only** (number of workers needed)
- **No manual rate entry** — base pay is automatically resolved from the group's configured rates:
  - Default: £30/hr for skilled trades
  - £25/hr for helpers/labourers
  - Configured via Base Pay Rates page (`/trader/base-pay`)
- Each line shows: role name, count, auto-resolved base pay, line total
- Add/remove labour type rows

**E. Totals Summary:**
- Materials total (item count + £ amount)
- Labour breakdown per type (count × base pay)
- **Grand Total** (materials + labour)

**F. Message to Customer:**
- Optional text message
- Optional voice note recording
- Sent alongside the quote

**G. Submit:**
- "Send Quote to Customer" button
- Disabled if grand total ≤ 0
- On success: job card removed from incoming, toast confirmation with total

### 5.5 Individual Trader Quote Flow (Cat B)

For individual traders (non-agency), Cat B jobs use an inline `QuoteBreakdown` component:

1. **Materials Section:** Add/remove items with description, quantity, unit price
2. **Labour Section:** Set hours + hourly rate
3. **Message:** Optional text + voice note
4. **Total:** Materials + (hours × rate)
5. **Submit:** "Send Estimate" triggers from the card footer button

### 5.6 Worker-Side: Company Job Cards (`CompanyJobCard`)

Individual traders who work for an agency see company-assigned jobs in a separate "From Your Company" section:

- Shows company name with `Building2` icon and "Assigned" shield badge
- Auto-accept timer (5 min countdown with progress bar)
- Job details: description, expected duration, photos
- **Budget is hidden** from workers (agency-only info)
- Workers submit item estimates via `WorkerQuoteRequest`:
  - Material/tool line items (description, qty, unit price)
  - Read-only base pay rate display (set by agency)
  - Labour hours input
  - Expandable job brief with customer details masked

### 5.7 Revenue & Earnings (`/trader/earnings` — `TraderEarnings.tsx`)

**Revenue Summary Card:**
- Total revenue (this month) with % change
- Auto-deposit bank info display

**Quick Stats Grid:**
- Gross income | Worker Pay | Platform Fees

**Income vs Expenses Chart:**
- Area chart with **Week / Month / Year toggle**
- Green gradient = Income, Red gradient = Expenses
- Interactive tooltip on hover
- Legend with running totals

**Transactions List:**
- Unified ledger with consistent styling:
  - **Income:** Green `+` prefix, `ArrowDownLeft` icon, green background
  - **Expenses:** Red `−` prefix, `ArrowUpRight` icon, red background
- **Tags** next to each transaction:
  - "Job Payment" (green tag) — customer payments
  - "Salary" (red tag) — worker payouts
  - "Platform Fee" (muted tag) — platform charges
- Each row: icon + title + tag + customer name + date + amount

### 5.8 Group / Agency Management

#### Groups List (`/trader/groups` — `Groups.tsx`)
- List of all groups with member counts and stats

#### Group Detail (`/trader/groups/:groupId` — `GroupDetail.tsx`)

**4-tab interface:**

| Tab | Content |
|---|---|
| **Performance** (default) | Group stats, links to individual worker profiles |
| **Members** | Member list with management (add/remove) |
| **Base Pay** | Universal or custom hourly rates per member; toggleable |
| **Payouts** | Financial overview + unified transaction ledger |

**Payouts Tab Details:**
- **Financial Overview Cards:**
  - Total Income (customer payments)
  - Total Payouts (worker disbursements)
  - Net Profit
  - Profit Margin (%)
- **Transactions Ledger** (unified — no separate "past payouts" and "recent transactions"):
  - Income rows: Green `+`, `ArrowDownLeft` icon, "Job Payment" tag
  - Expense rows: Red `−`, `ArrowUpRight` icon, "Salary" tag
  - Each row: title, date, amount, payment method

#### Worker Detail (`/trader/workers/:workerId` — `WorkerDetail.tsx`)
- Individual performance statistics
- Customer reviews and ratings
- Historical job assignments
- Payout history (scheduled vs manual)

#### Worker Payouts (`/trader/paychecks` — `Paychecks.tsx`)
- Current payroll cycle with draft amounts
- Payout schedule configuration (Manual / Weekly / Bi-weekly / Monthly)
- History of past payouts
- Manual trigger option with skip-week logic

#### Base Pay Configuration (`/trader/base-pay` — `BasePayConfig.tsx`)
- **Global hourly rates per service category**
- Expandable category accordions showing all services
- Per-service rate editing with £/hr input
- Bulk update buttons per category (£20, £25, £30, £35)
- Category average display
- Universal Save/Discard bar (sticky bottom) with change detection
- Validation: all rates must be > £0

### 5.9 Trader Services (`/trader/services` — `TraderServices.tsx`)
- Availability toggles per service
- Navigation card to Base Pay Rates configuration

---

## 6. Shared Features

### 6.1 Chat (`/chat` — `Chat.tsx`)
- Real-time messaging interface
- Customer ↔ Trader communication

### 6.2 Notifications (`/notifications` — `Notifications.tsx`)
- Role-specific notification types
- Job updates, payment confirmations, system alerts

### 6.3 Profile Management

| Route | Feature |
|---|---|
| `/profile` | Profile hub with role-specific menu sections |
| `/profile/details` | Personal information editing |
| `/profile/address` | Address management (multiple for customers, single for traders) |
| `/profile/security` | Security hub |
| `/profile/security/password` | Change password |
| `/profile/security/2fa` | Two-factor authentication setup |
| `/profile/security/sessions` | Active session management |
| `/profile/payments` | Payment methods (customer only) |
| `/profile/payouts` | Payout methods — Bank/IBAN (trader only) |
| `/profile/tax` | Company & tax information (trader only) |
| `/profile/notifications` | Notification preferences |
| `/profile/language` | Language & region settings |
| `/profile/favourites` | Saved traders (customer only) |
| `/profile/help` | Help centre |
| `/profile/feedback` | Give feedback (writes to `feedback` table) |
| `/profile/legal` | Legal documents hub |
| `/profile/legal/:section` | Individual legal document view |
| `/profile/verification` | KYC verification status |

### 6.4 Avatar System
- **boring-avatars** (beam variant) as fallback for users without photos
- 7-color palette: `#FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFEAA7, #DDA0DD, #98D8C8`
- Supabase Storage-backed image upload for custom avatars

### 6.5 Voice Notes
- Available in booking flow (customer) and quote submission (trader)
- `VoiceNoteRecorder` component with recording, playback, and waveform visualization
- Blob-based recording stored alongside messages/quotes

---

## 7. Database Schema & Security

### 7.1 Tables

#### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, auto-generated |
| user_id | uuid | References auth.users |
| full_name | text | Nullable |
| email | text | Nullable |
| phone | text | Nullable |
| avatar_url | text | Nullable |
| role | app_role enum | `customer` or `trader` |
| trader_type | trader_type enum | `individual` or `agency` (traders only) |
| street, city, postcode | text | Address fields |
| date_of_birth | date | Nullable |
| onboarding_status | enum | `role_selection` → `profile_setup` → `completed` |
| kyc_status | enum | `pending` → `verified` / `failed` / `manual_review` |
| created_at, updated_at | timestamptz | Auto-managed |

**RLS Policies:**
- Users can view, insert, update their own profile
- Public profiles viewable if `role = trader` AND `onboarding_status = completed`

#### `user_roles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | References auth.users |
| role | app_role enum | `customer` or `trader` |

**RLS:** Users can only SELECT their own roles. No INSERT/UPDATE/DELETE from client.

#### `saved_traders`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | The customer saving |
| trader_id | text | The trader being saved |
| created_at | timestamptz | Auto |

**RLS:** Users can INSERT, DELETE, SELECT their own saved traders only.

#### `feedback`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | Submitter |
| rating | integer | Required |
| message | text | Default empty string |
| created_at | timestamptz | Auto |

**RLS:** Users can INSERT and SELECT their own feedback only.

### 7.2 Enums
- `app_role`: `customer`, `trader`
- `trader_type`: `individual`, `agency`
- `onboarding_status`: `role_selection`, `profile_setup`, `completed`
- `kyc_status`: `pending`, `verified`, `failed`, `manual_review`

### 7.3 Functions
- `has_role(_user_id uuid, _role app_role)` — Security definer function for RLS policy checks without recursion

---

## 8. Component Architecture

### 8.1 Layout Components
- `MobileLayout` — App shell with role-aware bottom navigation
- `BottomNav` — Tab bar with role-specific items

### 8.2 Job Card Components

| Component | Used In | Purpose |
|---|---|---|
| `IncomingJobCard` | Home, Jobs/Incoming | Expandable card for new job offers with viewMode variants |
| `ActiveJobCard` | Home (schedule), Jobs/Active | Active job card with crew progress |
| `CompanyJobCard` | Jobs/Incoming (workers) | Company-assigned job card for agency workers |
| `SwipeableJobStack` | Home (legacy) | Horizontal swipe carousel for incoming jobs |
| `AssignmentCard` | Group history | Expandable completed job details |

### 8.3 Quote Components

| Component | Used In | Purpose |
|---|---|---|
| `CollaborativeQuote` | Jobs/Incoming (agency) | Multi-step agency quote flow with worker estimates |
| `QuoteBreakdown` | Jobs/Incoming (individual), Home (quote modal) | Inline materials + labour quote builder |
| `QuoteMessage` | CollaborativeQuote, QuoteBreakdown | Text + voice note message attachment |
| `WorkerQuoteRequest` | CompanyJobCard | Worker-side estimation submission |

### 8.4 `IncomingJobCard` View Modes

| Mode | Description |
|---|---|
| `individual` | Full details, inline QuoteBreakdown for Cat B, direct Pickup for Cat A |
| `agency` | Full details, triggers CollaborativeQuote for Cat B, triggers Assign modal for Cat A |
| `agency-worker` | Masked location, hidden budget, auto-accept timer, condensed brief |

### 8.5 `ActiveJobCard` Features
- "Up Next" gradient banner for priority jobs
- Crew progress bar (X/Y arrived) — conditionally shown based on time proximity
- Expandable crew member list with status badges (En Route / Arrived / Working / Done)
- Consistent action buttons: **Message Team** + **Remind**
- Customer details revealed on expand

### 8.6 Profile Components
- `AvatarUpload` — Camera icon overlay, Supabase Storage integration
- `ProfileHeader` — Name, email, avatar display
- `ProfileMenuSection` — Grouped settings links
- `ProfileLogout` — Sign-out with confirmation

### 8.7 Home Components (Customer)
- `HeroBanner`, `SearchBar`, `CategoryChips`, `ServiceTabs`
- `ProviderCard`, `ProviderList`, `SavedTradersList`
- `ServiceBundles`, `HorizontalScroll`

---

## 9. Design System

### 9.1 Theme
- CSS custom properties in `index.css` with HSL values
- Full dark mode support via `next-themes`
- Semantic tokens: `--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--accent`, `--destructive`, `--border`

### 9.2 Typography
- `font-heading` for display text
- Tight size scale: 9px–24px for mobile density

### 9.3 Color Conventions
- **Income/Positive:** `hsl(142, 70%, 45%)` — green
- **Expenses/Negative:** `hsl(var(--destructive))` — red
- **Warning/Urgency:** `hsl(25, 90%, 55%)` — amber/orange
- **Neutral tags:** `bg-muted text-muted-foreground`
- **Primary actions:** `bg-primary text-primary-foreground`

### 9.4 Transaction Tag System
| Tag | Color | Used For |
|---|---|---|
| Job Payment | Green bg + text | Customer payments received |
| Salary | Red bg + text | Worker payouts |
| Platform Fee | Muted bg + text | Platform charges |

### 9.5 Crew Status System
| Status | Icon | Color |
|---|---|---|
| En Route | Navigation | `--chart-4` (amber) |
| Arrived | MapPinCheck | `--primary` (blue) |
| Working | Wrench | `--chart-2` (orange) |
| Done | CircleCheck | `--chart-1` (green) |

### 9.6 Card Patterns
- `card-shadow` utility class for consistent elevation
- `rounded-2xl` standard border radius
- `border border-border` for subtle separation
- Gradient banners for priority states (Up Next)
- Inline card replacement pattern (e.g., CollaborativeQuote replaces IncomingJobCard)

### 9.7 Interactive Patterns
- Bottom-sheet modals for multi-step flows (Accept & Assign)
- Inline expansion for detail views (job cards)
- Inline replacement for complex flows (agency quote replaces card)
- Chip-based multi-select (individual worker assignment)
- Search + dropdown for worker selection
- Sticky save/discard bar for configuration pages

---

## Appendix: Route Map

```
/welcome                          → Splash
/auth/signup                      → Sign Up
/auth/signin                      → Sign In
/auth/forgot-password             → Forgot Password
/reset-password                   → Reset Password

/onboarding/role                  → Role Selection
/onboarding/profile               → Customer Profile Setup
/onboarding/trader-profile        → Trader Profile Setup (4 steps)

/                                 → Role-based Home (Customer or Trader)
/search                           → Search
/services                         → Service Categories
/services/:id                     → Service Detail
/services/:id/book                → Book Service (5 steps)
/categories                       → All Categories
/categories/:id                   → Category Detail
/bundles/:id                      → Bundle Detail
/traders/:id                      → Trader Public Profile
/traders/:id/services             → Trader's Services
/jobs                             → My Jobs (Customer)
/jobs/post                        → Post a Job
/bookings                         → Bookings

/trader/jobs                      → Job Management (3 tabs: Incoming, Active, Completed)
/trader/services                  → Manage Services
/trader/earnings                  → Revenue & Transactions
/trader/teams                     → Team Overview
/trader/groups                    → Groups List
/trader/groups/:id                → Group Detail (4 tabs)
/trader/workers/:id               → Worker Profile
/trader/paychecks                 → Worker Payouts
/trader/base-pay                  → Base Pay Configuration
/trader/assign-team               → Job Assignment
/trader/team-performance          → Team Performance
/trader/member-tasks              → Member Tasks
/trader/member-payouts/:id        → Individual Member Payouts

/chat                             → Messaging
/notifications                    → Notifications
/profile                          → Profile Hub
/profile/details                  → My Details
/profile/address                  → Address Management
/profile/security                 → Security Settings
/profile/security/password        → Change Password
/profile/security/2fa             → Two-Factor Auth
/profile/security/sessions        → Active Sessions
/profile/payments                 → Payment Methods (Customer)
/profile/payouts                  → Payout Methods (Trader)
/profile/tax                      → Company & Tax (Trader)
/profile/notifications            → Notification Preferences
/profile/language                 → Language & Region
/profile/favourites               → Saved Traders (Customer)
/profile/help                     → Help Centre
/profile/feedback                 → Give Feedback
/profile/legal                    → Legal Documents
/profile/legal/:section           → Legal Detail
/profile/verification             → KYC Verification
```

---

## Appendix: Flow Diagrams

### Agency Quote Flow (Cat B Jobs)

```
Customer posts Cat B job
        ↓
Agency sees job in Incoming tab
        ↓
Agency clicks "Send Estimate"
        ↓
Card is REPLACED inline with CollaborativeQuote
        ↓
Step 1: Choose → Group or Individuals
        ↓
Step 2: Review members (group) / Confirm selection (individuals)
        ↓
Step 3: Confirm assignment → "Assign & Request"
        ↓
Workers receive estimation request notification
        ↓
Step 4: Waiting... (collecting estimates)
        ↓
Workers submit itemized material/tool estimates
        ↓
Step 5: Agency Review
   ├── View individual worker estimates (expandable)
   ├── System auto-averages all estimates
   ├── Agency edits final materials list
   ├── Agency adds labour types + quantity (base pay auto-resolved)
   └── Agency sends final quote to customer
```

### Accept & Assign Flow (Cat A Jobs — Agency)

```
Agency sees Cat A job in Incoming tab
        ↓
Agency clicks "Pickup"
        ↓
Bottom-sheet modal opens
        ↓
Step 1: Choose → Group or Individuals
        ↓
Step 2: Select/review members
        ↓
Step 3: Confirm → Job accepted & assigned
```

### Individual Trader Quote Flow (Cat B Jobs)

```
Individual trader sees Cat B job
        ↓
Clicks "Send Estimate" → card expands
        ↓
Inline QuoteBreakdown appears:
   ├── Add material items (desc, qty, unit price)
   ├── Set labour hours + rate
   ├── Optional message + voice note
   └── Submit → quote sent to customer
```
