import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthState } from './store/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ManageAgentsPage from './pages/ManageAgentsPage';
import ManageTasksPage from './pages/ManageTasksPage';
import AddAgentPage from './pages/AddAgentPage'; // <-- Import new page
import AgentDetailsPage from './pages/AgentDetailsPage'; // <-- Import new page

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthState();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
              path="/manage-agents"
              element={<ProtectedRoute><ManageAgentsPage /></ProtectedRoute>}
            />
            {/* --- New Routes Added Below --- */}
            <Route
              path="/add-agent"
              element={<ProtectedRoute><AddAgentPage /></ProtectedRoute>}
            />
            <Route
              path="/agent-details/:agentId"
              element={<ProtectedRoute><AgentDetailsPage /></ProtectedRoute>}
            />
            {/* -------------------------------- */}
            <Route
              path="/manage-tasks"
              element={<ProtectedRoute><ManageTasksPage /></ProtectedRoute>}
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;