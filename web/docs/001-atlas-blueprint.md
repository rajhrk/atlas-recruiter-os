
# Atlas Recruiter OS

## Vision

Atlas Recruiter OS is a Talent Intelligence Platform built for technical recruiters.

Its purpose is to help recruiters identify, understand, and engage the best talent faster by combining structured recruiter intelligence, company intelligence, AI, and search into a single application.

---

# Product Goals

Atlas should become the operating system for technical recruiting.

The platform should enable recruiters to:

- Search any technical role
- Understand required skills
- Discover target companies
- Build Boolean searches
- Generate AI sourcing prompts
- View certifications
- View conferences
- Understand company landscapes
- Build talent maps

---

# Source of Truth

The Google Sheet is currently the master source of recruiter intelligence.

During development:

Google Sheet
→ Atlas Data Layer
→ Atlas Recruiter OS

In the future:

Supabase
→ Atlas Data Layer
→ Atlas Recruiter OS

The UI should never depend directly on the data source.

---

# Core Data

Atlas stores:

- Roles
- Skills
- Companies
- Certifications
- Conferences
- Products & Technologies
- Universities
- Job Titles

---

# Core Relationships

Atlas understands relationships between:

- Role ↔ Skill
- Role ↔ Company
- Role ↔ Certification
- Role ↔ Conference

---

# Features

Current and planned features include:

- Recruiter Search
- Company Intelligence
- Skill Intelligence
- Boolean Builder
- AI Prompt Builder
- Dashboard

---

# Development Principles

- Keep components reusable.
- Separate UI from business logic.
- Keep data separate from application logic.
- Build one working feature at a time.
- Prefer simple solutions over clever ones.
- Never break existing functionality.

---

# Long-Term Vision

Atlas should evolve into a SaaS platform for technical recruiting with:

- Authentication
- Recruiter workspaces
- Team collaboration
- AI-assisted sourcing
- Analytics
- Search intelligence
- Talent mapping
- Company intelligence