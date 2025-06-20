# TriageAI

TriageAI is an AI-powered technical support ticketing system designed to streamline the triage, assignment, and resolution of support requests. It leverages advanced AI to analyze, summarize, and prioritize tickets, helping human moderators and admins efficiently manage and resolve issues.

## 🚀 Features

- **User Authentication:** Secure signup and login for users, moderators, and admins.
- **Ticket Management:** Create, view, and track support tickets with status, priority, and assignment.
- **AI Ticket Triage:** Automated ticket analysis, summarization, and skill tagging using Gemini AI via Inngest.
- **Admin Panel:** Manage users, roles, and skills.
- **Role-Based Access:** Permissions for users, moderators, and admins.
- **Modern UI:** Responsive React interface with Tailwind CSS and Radix UI components.

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Radix UI, React Router
- **Backend:** Node.js, Express, Inngest, Gemini AI (via @inngest/agent-kit)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Email:** Nodemailer
- **Other:** Zod (validation), dotenv, cors

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Gemini API key (for AI triage)

### Environment Variables
Create a `.env` file in the `server/` directory with the following:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

### 1. Clone the Repository
```sh
git clone https://github.com/kyash99252/TriageAI.git
cd TriageAI
```

### 2. Install Dependencies
#### Server
```sh
cd server
npm install
```
#### Client
```sh
cd ../client
npm install
```

## 🏃 Running the Project Locally

### Start the Backend Server
```sh
cd server
npm run dev
```

### Start the Inngest Server
```sh
cd server
npx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```

### Start the Frontend Dev Server
```sh
cd client
npm run dev
```
The client will be available at `http://localhost:5173` (default Vite port).

## 🏗️ Build for Production

### Build Client
```sh
cd client
npm run build
```

### (Optional) Preview Production Build
```sh
npm run preview
```

## 💡 Usage

1. **Sign Up / Log In:** Create an account or log in as a user, moderator, or admin.
2. **Create Tickets:** Users can submit new support tickets describing their issues.
3. **AI Triage:** The system automatically analyzes and prioritizes tickets, suggesting required skills and helpful notes.
4. **Moderation & Assignment:** Moderators/admins can review, assign, and update ticket statuses.
5. **Admin Panel:** Admins can manage user roles and skills.

## 🚀 Deployment

- Deploy the backend (server) to any Node.js-compatible host (e.g., Render, Heroku, Vercel, AWS, etc.).
- Deploy the frontend (client) as a static site (e.g., Vercel, Netlify, GitHub Pages).
- Ensure environment variables are set in your deployment environment.

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for new features, bug fixes, or improvements.

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## 🙏 Acknowledgements

- [Inngest](https://www.inngest.com/) for event-driven workflows and AI integration
- [Gemini AI](https://ai.google.dev/gemini-api/docs) for advanced ticket triage
- [Radix UI](https://www.radix-ui.com/) and [Tailwind CSS](https://tailwindcss.com/) for UI components
- [Vite](https://vitejs.dev/) for fast frontend tooling

---
