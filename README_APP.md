# ResearchHub - ReactJS Version

A complete ReactJS application for research collaboration and project management.

## Features

### ✅ Authentication
- **Demo Login**: Use any email and password to sign in
- **Session Persistence**: User stays logged in across refreshes
- **Protected Routes**: Automatic redirect to login for unauthorized access

### ✅ Dashboard
- Welcome section with user name
- Statistics cards (projects, tasks, papers, collaborators)
- Recent activity feed
- Quick links to all sections
- Upcoming deadlines

### ✅ Projects Management
- **Create Projects**: Add new research projects with detailed information
  - Title, Description
  - Status (Planning, Active, On-Hold, Completed)
  - Priority (Low, Medium, High)
  - Start/End dates
  - Budget
  - Department & Institution
- **View Projects**: Browse all projects in a grid layout
- **Search & Filter**: Search by title/description and filter by status
- **LocalStorage**: All projects persist in browser storage

### ✅ Profile Management
- **View Profile**: Display user information
- **Edit Profile**: Update personal details
  - First Name, Last Name
  - Email
  - Institution, Department
  - Bio
- **Data Persistence**: Profile data saved to localStorage

### ✅ Research Papers
- **Browse Papers**: View all research papers
- **Add Papers**: Share new research with:
  - Title, Abstract
  - Authors (comma-separated)
  - Keywords (comma-separated)
  - Category selection
- **Search**: Find papers by title or abstract
- **Stats**: View counts and ratings
- **LocalStorage**: All papers persist in browser

### ✅ Beautiful UI
- Modern dark theme
- Responsive design
- Smooth animations and transitions
- Card-based layouts
- Color-coded badges and statuses
- Professional typography

## Tech Stack

- **React 18** (JavaScript, not TypeScript)
- **React Router v6** - Client-side routing
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool
- **CSS3** - Custom styling with CSS Grid & Flexbox
- **LocalStorage** - Client-side data persistence

## Getting Started

### Installation
```bash
cd research-hub
npm install
```

### Development
```bash
npm run dev
```
The app will run on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## Demo Login

Use **any email and password** to sign in. For example:
- Email: `user@researchhub.com`
- Password: `password123`

The system will create a demo account automatically.

## Project Structure

```
research-hub/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Navbar.css
│   │   └── ProtectedRoute.jsx
│   ├── context/            # React Context
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/              # Page components
│   │   ├── Landing.jsx     # Home page
│   │   ├── Login.jsx       # Login page
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Projects.jsx    # Projects management
│   │   ├── Profile.jsx     # User profile
│   │   ├── ResearchPapers.jsx
│   │   ├── Tasks.jsx       # Placeholder
│   │   └── Messages.jsx    # Placeholder
│   ├── App.jsx            # Main app with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json
└── vite.config.js
```

## Features in Detail

### LocalStorage Data
- **User Profile**: Stored in `localStorage.getItem('user')`
- **Projects**: Stored in `localStorage.getItem('projects')`
- **Research Papers**: Stored in `localStorage.getItem('researchPapers')`

### Navigation
- Landing Page (/)
- Login (/login)
- Dashboard (/dashboard) - Protected
- Projects (/projects) - Protected
- Profile (/profile) - Protected
- Research Papers (/research-papers) - Protected
- Tasks (/tasks) - Protected (placeholder)
- Messages (/messages) - Protected (placeholder)

## Future Enhancements

- Real backend API integration
- User registration
- File upload functionality
- Real-time collaboration
- Comments and reviews for papers
- Task management with deadlines
- Messaging system
- Team collaboration features
- Export/Import data

## Notes

- All data is stored locally in the browser
- No backend server required
- Demo authentication accepts any credentials
- Data persists across sessions until browser storage is cleared

---

Built with ❤️ using React

