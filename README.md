# mdx-editor

## Clone Repo
```bash
git clone https://github.com/rafat-alam/mdx-editor.git
cd mdx-editor
```

## Create .env file
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
```

## Run Project (Live / Fast-Refresh)
Run these commands inside mdx-editor folder
```bash
npm install
npm run dev
```

## Run Project (Stable & Fast)
Run these commands inside mdx-editor folder
```bash
npm install
npm run build
npm run start
```
