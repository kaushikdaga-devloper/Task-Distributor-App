# Task Distributor App - MERN Stack Assignment 

## Demo Video

Watch the working demo of the application here:  
[Google Drive Link](https://drive.google.com/file/d/1dV3hjWRD5rpFyLMLZJ13D-fCkWxExCEl/view?usp=sharing)

---

## Overview

This project is a task distribution web application built using the MERN stack. It allows an admin user to log in, create agents, upload a CSV file, and automatically distribute tasks (rows from the CSV) equally among the agents.

This project was developed as part of a machine test for a MERN Stack Developer assessment.

---

## Features

- Admin login using JWT authentication
- Agent management (Add, View)
- Upload `.csv`, `.xls`, or `.xlsx` files with fields:
  - FirstName (Text)
  - Phone (Number)
  - Notes (Text)
- Automatic distribution of list items among 5 agents
- Displays each agent’s assigned tasks in the frontend
- All data is stored in MongoDB

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT

---

## Folder Structure

Task-Distributor-App/
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── .env.example
│ └── server.js
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ └── App.jsx
│ └── vite.config.js
└── README.md


---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Task-Distributor-App.git
cd Task-Distributor-App
2. Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in the backend/ directory based on .env.example. Example content:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_jwt_secret
Start the backend server:

bash
Copy
Edit
npm start
3. Frontend Setup
In a new terminal window:

bash
Copy
Edit
cd frontend
npm install
npm run dev
The frontend will run at: http://localhost:5173

The backend will run at: http://localhost:5000

Usage
Login using admin credentials

Add agents by entering their name, email, phone, and password

Upload a CSV/XLS/XLSX file with valid data (FirstName, Phone, Notes)

The tasks will be equally divided among 5 agents

View each agent’s assigned tasks on the frontend dashboard

Notes
Only .csv, .xls, or .xlsx files are accepted

Extra tasks (if not divisible by 5) are assigned in order among agents


