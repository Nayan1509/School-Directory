# 🏫 School Directory

A full-stack **School Directory** app built with **Next.js (Pages Router)**, **MySQL (Railway)**, **Cloudinary**, and **SendGrid** for OTP-based authentication.

Users can:
- View all schools (public).
- Login with **Email OTP** (6-digit code, 10-min expiry).
- Add, edit, or delete schools (authenticated users only).
- Upload school images (stored on Cloudinary).
---

## 🚀 Tech Stack
- **Frontend**: Next.js (Pages Router), TailwindCSS, Framer Motion, React Hot Toast
- **Backend**: Next.js API routes, MySQL (via Railway), Cloudinary
- **Auth**: JWT cookies + Email OTP login (SendGrid)
- **Deployment**: Vercel (frontend + backend APIs), Railway (MySQL), Cloudinary (images)

---

## 📂 Folder Structure

```
school-directory/
│
├── components/
│   └── Navbar.jsx           # Shared navigation bar
|   └── AddSchoolForm.jsx.       
|   └── EditSchoolForm.jsx
│
├── lib/
│   └── db.js            # MySQL connection (PlanetScale)
|   └── cloudinary.js    # Cloudinary connection
|   └── auth.js          # User Authentication
│
├── pages/
│   ├── _app.js          # App wrapper (imports global styles)
│   ├── index.js         # Landing page
│   ├── addSchool.jsx    # Form to add new schools
│   ├── showSchools.jsx  # List of all schools
|   ├── login.jsx        # User authentication with OTP
|   ├── dashboard.jsx    # Admin dashboard to manage schools
│   └── api/
│       ├── addSchool.js  # API to insert school into DB
│       └── getSchools.js # API to fetch schools
│       └── delete.js     #API to delete schools from database
│       └── logout.js     #API Logout
│       └── me.js         #API to check user login asset
│       └── requestOtp.js #API to send OTP
│       └── verifyOtp.js  #API to verify
│       └── updateSchool.js  #API to update school info
│
├── public/
│   └── schoolImages/    # (local storage only, not used in production)
│
├── styles/
│   └── globals.css      # TailwindCSS imports
│
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## ⚙️ Setup (Local Development)

### 1️⃣ Clone repo & install dependencies
```bash
git clone <your-repo-url>
cd school-directory
npm install
```

### 2️⃣ Configure Database
- Use **PlanetScale** for production or local MySQL for development
- Create `.env.local` file in root:
```env
DATABASE_URL="mysql://username:password@host/school_directory?sslaccept=strict"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3️⃣ Run database migration
Create table in your MySQL DB:
```sql
CREATE TABLE schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  contact VARCHAR(20) NOT NULL,
  email_id VARCHAR(100) NOT NULL,
  image VARCHAR(255) NOT NULL
);
```

### 4️⃣ Start development server
```bash
npm run dev
```
Visit 👉 `http://localhost:3000`

---

## ☁️ Cloudinary Setup (Image Storage)
Vercel **does not support persistent local storage**.  
To handle image uploads in production, we use **Cloudinary**.  

### Steps:
1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Go to **Dashboard** and copy your:
   - `CLOUD_NAME`
   - `API_KEY`
   - `API_SECRET`
3. Add these to `.env.local` and also in Vercel project settings.  
4. Update your `addSchool` API to upload to Cloudinary instead of saving locally.

Example upload code:
```js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const result = await cloudinary.uploader.upload(filePath, {
  folder: "schools",
});
// Save result.secure_url in DB
```

---

## 🌐 Deployment

### ✅ Frontend on Vercel
1. Push project to GitHub.  
2. Go to [Vercel](https://vercel.com) → **New Project** → import your repo.  
3. Add environment variables in **Vercel Dashboard → Project Settings → Environment Variables**:  
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`  
4. Deploy → Vercel auto-builds Next.js.

### ✅ Database on Railway
1. Sign up at Railway.  
2. Create a new database → name: `school_directory`.  
3. Create a password in **Settings → Passwords → New Password**.  
4. Copy the connection string and add it to `.env.local` and Vercel.  
5. Run the SQL migration (see Setup step 3).  

### ✅ Image Storage with Cloudinary
1. Already configured locally.  
2. Make sure Cloudinary env vars are added in Vercel.  
3. Your uploaded images will now persist across deployments.

---

## 🛠️ Tech Stack
- **Next.js (Pages Router)**
- **TailwindCSS v3**
- **Framer Motion** (animations)
- **Railway (MySQL)**
- **Cloudinary** (image storage)
- **Vercel** (frontend hosting)

---

## 📜 License
MIT License – free to use, modify, and distribute.

---

💡 Made with ❤️ using **Next.js + Tailwind + Railway + Cloudinary**
