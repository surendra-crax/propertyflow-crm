# PropertyFlow CRM — Project Overview

**Built by WebXAI** | [webxaitech.com](https://webxaitech.com)
**Live Demo:** [propertyflow.webxaitech.com](https://propertyflow.webxaitech.com)

---

## What Is PropertyFlow CRM?

PropertyFlow CRM is a full-stack, production-grade **Customer Relationship Management system purpose-built for the real estate industry**. It is developed and deployed by WebXAI as a white-label SaaS platform for real estate agencies, brokers, and property developers.

The platform helps real estate companies:
- Capture and track leads from multiple sources
- Manage the entire sales pipeline from inquiry to deal closure
- Schedule and track site visits
- Monitor agent and team performance
- Automate WhatsApp follow-ups
- Generate analytics and revenue reports

PropertyFlow CRM is not a generic CRM — it is designed ground-up for Indian real estate workflows, including support for brokers, multiple agent roles, site visit scheduling, and project-based lead management.

---

## Who Is It For?

| User Type | Role in the CRM |
|-----------|----------------|
| **Company Admin** | Full access — manages agents, brokers, and all data |
| **Sales Manager** | Monitors team performance, approves deals, views analytics |
| **Sales Agent** | Manages assigned leads, updates status, logs follow-ups |
| **Broker** | Views their referred leads and commission-based deals |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 14** (App Router) | React-based frontend framework with SSR/CSR support |
| **TypeScript** | Type-safe development across the entire frontend |
| **Tailwind CSS** | Utility-first CSS for rapid, consistent UI development |
| **next-themes** | Dark mode / Light mode toggle with system preference support |
| **Lucide React** | Icon library used throughout the UI |
| **Axios** | HTTP client for all API communication |
| **Recharts** | Data visualization for revenue charts and analytics |

### Backend
| Technology | Purpose |
|-----------|---------|
| **NestJS** | Scalable Node.js framework with modular architecture |
| **TypeScript** | Type safety on the backend |
| **Prisma ORM** | Database querying, schema management, and migrations |
| **PostgreSQL** | Relational database for all CRM data |
| **JWT (JSON Web Tokens)** | Authentication and role-based access control |
| **Passport.js** | JWT strategy implementation |
| **Bcrypt** | Secure password hashing |
| **Resend SDK** | Transactional email API for reliable delivery (via HTTP) |

### Infrastructure & Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting with global CDN and auto-SSL |
| **Render** | Backend (NestJS API) hosting |
| **Supabase** | Managed PostgreSQL with pgBouncer transaction-mode pooling (Port 6543) |
| **GitHub** | Version control and CI/CD trigger for auto-deployments |
| **Hostinger** | Domain registrar for webxaitech.com (Custom CNAME config) |
| **Resend** | Transactional email API (bypasses SMTP blocks on cloud hosts) |

---

## How It Works

### Architecture Overview

```
User Browser
    │
    ▼
Vercel CDN (propertyflow.webxaitech.com)
    │   Next.js Frontend
    │   - Landing page (public)
    │   - Login / Demo login
    │   - CRM dashboard (authenticated)
    │
    ▼ REST API calls (JWT-authenticated)
Render (propertyflow-crm.onrender.com)
    │   NestJS Backend
    │   - Auth (login, JWT issue)
    │   - Leads, Deals, Projects
    │   - Site Visits, Follow-ups
    │   - Analytics, Reports
    │   - Email notification service
    │
    ▼
Supabase (PostgreSQL)
    - Users, Leads, Projects
    - Deals, Site Visits
    - Notifications, Activities
```

### Authentication Flow
1. User visits `propertyflow.webxaitech.com` → sees the **Landing Page**
2. Clicks "View Live Demo" → reaches Demo Login page
3. Selects a role (Admin or Agent) → frontend sends credentials to `/auth/login`
4. Backend validates credentials, returns a **JWT token**
5. Token stored in `localStorage` — all subsequent API calls attach it via `Authorization: Bearer <token>`
6. Role-based guards on the backend control what each user can access

### Lead Lifecycle
```
Lead Created → Contacted → Site Visit Scheduled → Negotiation → Deal Closed
     ↑               ↑              ↑                   ↑             ↑
  (Agent)         (Agent)        (Agent)             (Manager)    (Manager)
```

---

## Key Features

### 1. Lead Management
- Create, assign, and track leads with status pipeline
- Full lead detail pages with activity timeline
- Filter leads by status, source, project, and agent
- Export leads to CSV

### 2. Pipeline Board
- Kanban-style drag view of leads across pipeline stages
- Visual deal forecasting by stage

### 3. Site Visit Scheduling
- Schedule property visits directly from a lead profile
- Track status: Scheduled → Completed / Cancelled
- Automated date and time management

### 4. WhatsApp Follow-up Integration
- One-click WhatsApp message pre-filled with lead details
- Tracks follow-up history and pendng actions

### 5. Deal Management
- Convert closed leads to formal deals
- Track sale value, commission, and assigned broker
- Deal analytics by month and agent

### 6. Analytics Dashboard
- Revenue charts (monthly, by project)
- Agent leaderboard with conversion rates
- Lead source breakdown
- Pipeline forecast

### 7. Project Management
- Create real estate projects (residential, commercial)
- Assign leads to specific projects
- Project-wise revenue and lead analytics

### 8. Role-Based Access Control
- Admin: full system access
- Manager: team analytics, deal approval
- Agent: own leads and follow-ups only
- Broker: limited to referred leads and commissions

### 9. Dark Mode
- Full light/dark theme support across all pages
- Respects system preference, also manually toggleable

### 10. Landing Page with Lead Capture
- Professional marketing landing page
- Contact/demo request form with strict validation (blocks fake emails/numbers)
- Real-time email notifications sent to WebXAI via Resend API
- "CRM Deployment Plans" pricing section (Starter / Business / Enterprise)
- Live dashboard preview screenshot

---

## Database Schema (Summary)

| Table | Description |
|-------|-------------|
| `User` | Agents, Managers, Admins — all CRM users |
| `Lead` | Every property inquiry / prospect |
| `Project` | Real estate projects leads are linked to |
| `Deal` | Closed/won leads converted to formal deals |
| `SiteVisit` | Scheduled property visits for leads |
| `Broker` | Referring brokers with commission tracking |
| `Activity` | Timeline log of every action on a lead |
| `Notification` | In-app notifications for users |

---

## CRM Deployment Plans (Offered by WebXAI)

WebXAI deploys and customizes this CRM for real estate companies under the following plans:

| Plan | Price | Best For |
|------|-------|---------|
| **Starter CRM** | ₹15,000/mo or ₹1,50,000/yr | Small real estate teams |
| **Business CRM** | ₹30,000/mo or ₹3,00,000/yr | Growing agencies |
| **Enterprise CRM** | Custom (under ₹3,00,000 deployment) | Large developers & companies |

Each deployment is fully custom-branded for the client's company.

---

## Future Scope

The following enhancements are planned or scoped for future versions:

### Near-Term (3–6 months)
- **Mobile App** — React Native companion app for agents on the field
- **Automated Lead Capture** — Integrate with Facebook Ads, MagicBricks, 99acres APIs to auto-import leads
- **WhatsApp Business API** — Replace manual WhatsApp links with automated templated messages via official WA Business API
- **Email Drip Campaigns** — Automated email sequences for lead nurturing
- **Google Calendar Sync** — Sync site visits with agent's Google Calendar

### Medium-Term (6–12 months)
- **AI Lead Scoring** — Machine learning model to score leads by conversion probability based on behavior and profile
- **SMS/IVR Integration** — Auto-call or SMS reminders for follow-ups via Twilio or MSG91
- **Document Management** — Attach agreement PDFs, brochures, floor plans to leads and deals
- **Commission Calculator** — Automate broker commission computation per deal
- **Multi-branch Support** — One CRM, multiple city/branch offices with isolated pipelines

### Long-Term Vision
- **PropTech Marketplace** — Allow property developers to list projects directly inside the CRM for agent assignment
- **AI Chatbot** — Website chatbot that qualifies leads and creates CRM entries automatically
- **Advanced Reporting** — Scheduled PDF/Excel reports emailed to management weekly
- **Multi-language Support** — Hindi and regional language support for the CRM UI
- **White-label SaaS Portal** — Self-service portal where clients can manage their own CRM instance

---

## Contact & Licensing

PropertyFlow CRM is a proprietary product of **WebXAI**.

For deployment inquiries, custom feature development, or business partnerships:

- **Website:** [webxaitech.com](https://webxaitech.com)
- **Email:** webxdev.ai@gmail.com
- **Product:** [propertyflow.webxaitech.com](https://propertyflow.webxaitech.com)

> This CRM is deployed and customized specifically for each real estate client.
> It is not available as a self-hosted open-source product.
> All source code is proprietary and owned by WebXAI.

---

*Document version: March 2026 | Built with ❤️ by WebXAI*
