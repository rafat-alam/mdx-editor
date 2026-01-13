# MDX Editor 🚀

**MDX Editor** is a powerful and intuitive platform built to help you **create, organize, and share knowledge** effortlessly. Whether you’re writing technical documentation, learning notes, or community guides, MDX Editor gives you everything you need in one place.

## Why MDX Editor? ✨

* 📁 **Structured Repositories**
  Organize your content using folders and MDX files. Treat folders as topics and files as subtopics for a clean, logical hierarchy.

* ✍️ **Rich MDX Editing with Live Preview**
  Write Markdown, JSX, and code blocks with real-time previews so you always see exactly what you’re building.

* 🤖 **AI-Powered Content Generation (RAG)**
  Generate accurate, up-to-date documentation using:

  * Repo-wide context
  * Web crawling for fresh information
  * URL-based trusted sources
  * LLM-only generation for quick drafts

* 🛠️ **Smart Content Refinement**
  Improve clarity, structure, and accuracy with AI-assisted refinements—enhance specific sections without rewriting everything.

* 🌍 **Share with the Community**
  Publish repositories publicly to help others learn, or keep them private for personal use.

* 🎓 **Learn by Exploring**
  Browse public repositories, view combined topics, and get inspired by community-driven knowledge.

## Built for Everyone 💡

* Developers & engineers
* Students & learners
* Writers & educators
* Teams building internal docs

**Free to use, easy to start, and powerful as you grow**, MDX Editor transforms ideas into **well-structured, shareable documentation**—faster and smarter.

## Future Updates:
    In v1
    1. Update Forgot-Pass
    2. Finish Editor
    3. Middleware to Proxy
    4. Rename File, Folder, Repos

    In v2
    1. Profile Settings
    2. Change Name
    3. Change Username
    4. Change Email
    5. Change Password

## Project Structure
```
db/
├── index.ts (function to get _db)
└── schema.ts

public/
└── team (team profile picture)

src/
├── app/
│   ├── about          (page)
│   │
│   ├── api
│   │   ├── ai
│   │   │   └── gemini                (route)
│   │   │
│   │   ├── rag                       (route)
│   │   │
│   │   ├── auth
│   │   │   ├── [...nextauth]         (route)
│   │   │   ├── forgot-pass           (route)
│   │   │   └── signup                (route)
│   │   │
│   │   ├── edit
│   │   │   ├── add-file              (route)
│   │   │   ├── add-folder            (route)
│   │   │   ├── add-repo              (route)
│   │   │   ├── get-all-public-repos  (route)
│   │   │   ├── get-path              (route)
│   │   │   ├── remove                (route)
│   │   │   ├── rename                (route)
│   │   │   ├── save                  (route)
│   │   │   └── set-repo-vis          (route)
│   │   │
│   │   └── u/[username]              (route)
│   │
│   ├── editor         (page)
│   ├── forgot-pass    (page)
│   ├── public-repos   (page)
│   ├── settings       (page)
│   ├── signin         (page)
│   └── u/[...path]    (page)
│
├── components
│   ├── about
│   ├── dashboard
│   ├── editor
│   ├── home
│   ├── nav-menu
│   ├── public-repos
│   ├── signin
│   ├── signup
│   ├── ui
│   ├── ui2
│   └── themeprovider
│
├── data/
│   └── team_members_data.json
│
├── lib/
│   └── utils.ts
│
├── module/
│   ├── entities/
│   │   ├── node.ts
│   │   └── user.ts
│   │
│   ├── repo/
│   │   ├── node_repo.ts
│   │   └── user_repo.ts
│   │
│   └── services/
│       ├── auth_service.ts
│       ├── helper_service.ts
│       ├── node_service.ts
│       └── user_service.ts
│
└── store/
    ├── authSlice.ts
    └── store.ts

types/
└── next-auth.d.ts

.env
.gitignore
components.json
drizzle.config.ts
eslint.config.mjs
LICENSE
next.config.ts
package-lock.json
pakage.json
postcss.config.mjs
README.md
tsconfig.json
```

## Local Development Setup
### Clone Repo
```bash
git clone https://github.com/rafat-alam/mdx-editor.git
cd mdx-editor
```

### Create .env file
Add .env inside mdx-editor folder
```.env
# Database connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?sslmode=require"

# NextAuth secret key
NEXTAUTH_SECRET="your_nextauth_secret_here"

# SMTP (Brevo) credentials
BRAVO_USER="your_brevo_username_here"
BRAVO_PASS="your_brevo_password_here"

# Gemini API key
GEMINI_API_KEY="your_gemini_api_key_here"

# Upstash (Redis API)
UPSTASH_REDIS_REST_URL="https://user-redis-0000.upstash.io"
UPSTASH_REDIS_REST_TOKEN="upstash_redis_rest_token_here"
```

### Install Dependencies
```bash
npm install
```

### Run Drizzle ORM (First Time Only)
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Run Project (Live / Fast-Refresh)
Run these commands inside mdx-editor folder
```bash
npm run dev
```

### Run Project (Stable & Fast)
Run these commands inside mdx-editor folder
```bash
npm run build
npm run start
```

## LICENCE (MIT)
```
MIT License

Copyright (c) 2025 Rafat Alam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
---