# Dummy Data & Collaboration Features

## Overview

This application now includes comprehensive dummy data to demonstrate all collaboration and connection features. The dummy data is automatically initialized when the app loads for the first time.

---

## Dummy Users Added

The application includes **6 dummy users** with realistic profiles:

1. **Sarah Johnson** (Researcher)
   - Email: `sarah.johnson@university.edu`
   - Institution: Stanford University
   - Department: Computer Science
   - Bio: AI researcher specializing in machine learning and neural networks

2. **Michael Chen** (Professor)
   - Email: `michael.chen@university.edu`
   - Institution: MIT
   - Department: Data Science
   - Bio: Professor of Data Science with focus on big data analytics

3. **Emma Wilson** (Researcher)
   - Email: `emma.wilson@university.edu`
   - Institution: Harvard University
   - Department: Environmental Science
   - Bio: Climate change researcher studying coastal ecosystems

4. **David Brown** (Researcher)
   - Email: `david.brown@university.edu`
   - Institution: UC Berkeley
   - Department: Physics
   - Bio: Quantum physics researcher working on quantum computing

5. **Lisa Anderson** (Professor)
   - Email: `lisa.anderson@university.edu`
   - Institution: Yale University
   - Department: Biology
   - Bio: Molecular biology professor specializing in genetics

6. **James Martinez** (Researcher)
   - Email: `james.martinez@university.edu`
   - Institution: Princeton University
   - Department: Mathematics
   - Bio: Mathematical modeling researcher in applied mathematics

---

## Dummy Data Included

### 📁 Projects (5 Projects)
- AI-Powered Climate Modeling (Active, 65% progress)
- Quantum Computing Algorithms (Active, 45% progress)
- Marine Ecosystem Restoration (Active, 78% progress)
- Big Data Analytics Framework (Planning, 15% progress)
- Genetic Engineering Techniques (Active, 82% progress)

### 📄 Research Papers (5 Papers)
- Deep Learning for Climate Prediction
- Quantum Algorithms for Optimization
- Coral Reef Restoration Strategies
- Scalable Distributed Computing for Big Data Analytics
- CRISPR-Cas9 Gene Editing: Advances and Ethical Considerations

### 👥 Connections
Each user has 2-3 existing connections, demonstrating:
- Connected researchers
- Working collaboration features
- Realistic network structure

### 📨 Messages
Pre-populated conversations between users showing:
- Message history
- Multiple conversations
- Read/unread status

### ✅ Tasks
Each user has 2-4 tasks with:
- Completed and active tasks
- Realistic task descriptions
- Timestamps

### 🔔 Pending Requests
Some users have pending connection requests to demonstrate:
- Accept/decline functionality
- Request notifications

---

## How It Works

### Automatic Initialization

The dummy data is automatically initialized when the app loads. The initialization happens in `src/utils/initDummyData.js` and is called from `src/App.jsx`.

**Key Features:**
- Only initializes once (checks `dummyDataInitialized` flag)
- Merges with existing data (doesn't overwrite)
- Comprehensive data for all features

### Data Storage

All dummy data is stored in localStorage with the following keys:
- `globalAllUsers` - All registered users
- `globalProjects` - All research projects
- `globalResearchPapers` - All research papers
- `connections_{userId}` - User's connections
- `pendingRequests_{userId}` - User's pending requests
- `messages_{userId}` - User's messages
- `tasks_{userId}` - User's tasks

---

## Testing Collaboration Features

### 1. **Viewing Other Users**
- Go to **Collaborators** page
- You'll see all 6 dummy users
- Search and filter functionality works

### 2. **Connection Requests**
- Some users have pending requests (Sarah, Michael)
- You can accept/decline requests
- Send new connection requests to any user

### 3. **Viewing Connections**
- Each user has 2-3 existing connections
- View your connections list
- Remove connections if needed

### 4. **Messaging**
- Go to **Messages** page
- Select any user from the list
- View existing conversations
- Send new messages

### 5. **Projects**
- View 5 pre-loaded projects
- See project creators (Sarah, Michael, Emma, David, Lisa)
- All projects are globally visible

### 6. **Research Papers**
- View 5 pre-loaded papers
- See paper uploaders
- Read reviews and ratings
- Download papers (file names shown)

### 7. **Dashboard**
- Real stats calculated from dummy data
- Recent activity shows user actions
- Upcoming deadlines from projects

---

## How to Test

1. **Login with any email/password** (demo login)
2. **Navigate to Collaborators** - See all 6 dummy users
3. **Send connection requests** - Click "Connect" on any user
4. **Check Messages** - View existing conversations or start new ones
5. **View Projects** - See all 5 projects created by different users
6. **View Research Papers** - Browse papers uploaded by various researchers
7. **Check Dashboard** - See real stats and activity

---

## Features Verified Working

✅ **User Discovery**
- All dummy users visible in Collaborators
- Search functionality works
- User profiles display correctly

✅ **Connection Management**
- Send connection requests
- Accept/decline requests
- View existing connections
- Remove connections

✅ **Messaging**
- View conversations
- Send messages
- Message persistence
- Real-time updates

✅ **Collaboration**
- Projects visible to all users
- Research papers globally accessible
- User attribution on all content
- Reviews and ratings working

✅ **Data Persistence**
- All data stored in localStorage
- Data persists across sessions
- New users can see existing data

---

## Resetting Dummy Data

If you want to reset the dummy data:

1. Open browser console (F12)
2. Run: `localStorage.removeItem('dummyDataInitialized')`
3. Refresh the page
4. Dummy data will be re-initialized

---

## Notes

- Dummy data is initialized only once (on first app load)
- Existing user data is preserved
- New users you create will be added to the global list
- All collaboration features work seamlessly with dummy data
- The app is fully functional for testing and demonstration

---

## Repository

Code pushed to: **https://github.com/Tharak23/collab-hub-researchers**

---

*Last Updated: November 5, 2025*

