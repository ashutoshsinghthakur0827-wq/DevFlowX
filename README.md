
# 🚀 DevFlow X

### AI-Powered Software Engineering Management Platform

DevFlow X is a full-stack software engineering management platform designed to help developers and teams manage projects, tasks, team members, and AI-powered development workflows from one place.

The platform combines a modern React frontend, Node.js backend, and Python FastAPI AI service to provide a centralized workspace for software development and collaboration.

---

## 🌟 Features

### 📊 Project Dashboard
- View project statistics
- Track development progress
- Monitor tasks and activities
- Responsive dashboard interface

### 📁 Project Management
- Create and manage projects
- Organize project information
- Track project progress
- View project details

### ✅ Task Management
- Create and manage tasks
- Track task status
- Organize development activities
- Support task-based project workflows

### 👥 Team Management
- Create teams
- Add team members
- Assign member roles
- Remove members
- Manage team information

### 🤖 AI Assistant
- AI-powered development assistance
- Connect with the AI service
- Generate helpful responses for development tasks
- Support AI-based engineering workflows

### 📚 RAG Assistant
- Document-based question answering
- Retrieval-Augmented Generation workflow
- ChromaDB vector storage
- Python FastAPI AI service

### 📈 Analytics
- Project insights
- Task-related statistics
- Development progress overview

### 🔗 GitHub Integration
- GitHub repository integration
- Retrieve repository-related information
- Connect development workflows with GitHub

### 🎨 Modern User Interface
- Responsive layout
- Dark and light theme support
- Modern dashboard design
- Mobile-friendly components
- Interactive React interface

---

## 🏗️ Project Architecture

```text
DevFlowX/
│
├── frontend-react/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── data/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
│
├── ai-service/
│   ├── app/
│   │   ├── rag/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── main.py
│   │   └── schemas.py
│   ├── data/
│   └── requirements.txt
│
├── frontend/
│   ├── css/
│   ├── js/
│   └── index.html
│
└── README.md
```

---

## 🛠️ Technology Stack

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Responsive Design

### Backend
- Node.js
- Express.js
- JavaScript
- REST APIs

### AI Service
- Python
- FastAPI
- Retrieval-Augmented Generation (RAG)
- ChromaDB
- AI/LLM integration

### Development Tools
- Git
- GitHub
- Visual Studio Code
- npm
- Python Virtual Environment

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ashutoshsinghthakur0827-wq/DevFlowX.git
```

Move into the project directory:

```bash
cd DevFlowX
```

---

## 🖥️ Frontend Setup

Open a terminal in the frontend directory:

```bash
cd frontend-react
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in your terminal.

---

## 🔧 Backend Setup

Open another terminal:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

If your project uses a development script, you can also run:

```bash
npm run dev
```

---

## 🤖 AI Service Setup

Open another terminal:

```bash
cd ai-service
```

Create a Python virtual environment:

```bash
python -m venv .venv
```

Activate the environment on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI service:

```bash
python -m uvicorn app.main:app --reload
```

The FastAPI documentation can be accessed at:

```text
http://127.0.0.1:8000/docs
```

---

## 🔐 Environment Variables

Create an environment file when required by the application.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

**Important:**
- Never upload API keys to GitHub.
- Never commit passwords or private credentials.
- Add `.env` to `.gitignore`.
- Use example environment files for public configuration documentation.

---

## 🔄 Application Workflow

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js / Express Backend
  │
  ├── Project Management
  ├── Task Management
  ├── Team Management
  ├── Authentication
  └── GitHub Integration
  │
  ▼
Python FastAPI AI Service
  │
  ├── AI Assistant
  ├── Document Processing
  ├── RAG Pipeline
  └── ChromaDB Vector Store
```

---

## 📌 Main Modules

| Module | Description |
|---|---|
| Dashboard | Displays project and task information |
| Projects | Manages development projects |
| Tasks | Organizes and tracks tasks |
| Team | Manages team members and roles |
| AI Assistant | Provides AI-based assistance |
| RAG Assistant | Uses document-based retrieval |
| Analytics | Shows development-related insights |
| Settings | Manages application settings |
| GitHub | Provides repository-related integration |

---

## 🎯 Project Objectives

1. Create a centralized software engineering workspace.
2. Improve project and task organization.
3. Support collaboration between team members.
4. Integrate AI into software development workflows.
5. Use RAG for document-based information retrieval.
6. Provide a modern and responsive user interface.
7. Build a practical full-stack portfolio project.

---

## 🔮 Future Enhancements

- User authentication with JWT
- MongoDB database integration
- Real-time team collaboration
- Advanced role-based access control
- AI-generated project summaries
- Automated task recommendations
- GitHub issue synchronization
- Deployment with cloud services
- Automated testing and CI/CD
- Advanced analytics dashboard

---

## 📱 Responsive Design

DevFlow X is designed to support:

- Desktop screens
- Laptop screens
- Tablets
- Mobile devices

The interface uses responsive layouts to improve usability across different screen sizes.

---

## 👨‍💻 Developer

**Ashutosh Singh**

Computer Science and Engineering — Artificial Intelligence and Machine Learning

Project: DevFlow X

---

## 📄 License

This project is intended for educational, learning, and portfolio development purposes.

A suitable open-source license can be added in the future.

---

## ⭐ Support

If you find this project useful, consider starring the repository on GitHub.

Repository:

https://github.com/ashutoshsinghthakur0827-wq/DevFlowX