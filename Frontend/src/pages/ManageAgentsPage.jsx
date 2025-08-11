import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';
import Card from '../components/Card';

const ManageAgentsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const { token } = useAuthState();
  const navigate = useNavigate();

  // --- This function now ONLY fetches agents to ensure the page loads quickly ---
  const fetchAgents = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const agentsResponse = await axiosInstance.get('/agents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (agentsResponse && Array.isArray(agentsResponse.data)) {
        setAgents(agentsResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      alert("A critical error occurred while fetching agents.");
    } finally {
      // The main loading is finished once agents are fetched.
      setIsLoading(false);
    }
  }, [token]);

  // --- This NEW, SEPARATE function fetches tasks in the background ---
  const fetchTaskCounts = useCallback(async () => {
    if (!token) return;
    try {
      const tasksResponse = await axiosInstance.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (tasksResponse && Array.isArray(tasksResponse.data)) {
        const tasks = tasksResponse.data;
        const counts = tasks.reduce((acc, task) => {
          const agentId = task.assignedTo?._id;
          if (agentId) {
            acc[agentId] = (acc[agentId] || 0) + 1;
          }
          return acc;
        }, {});
        setTaskCounts(counts); // Update the counts, causing the table to re-render with numbers.
      }
    } catch (error) {
      console.error("Could not fetch task counts:", error);
      // We don't show an alert here, so the page remains usable. Counts will just be 0.
    }
  }, [token]);

  // useEffect now calls both functions. They run independently.
  useEffect(() => {
    fetchAgents();
    fetchTaskCounts();
  }, [fetchAgents, fetchTaskCounts]);

  return (
    <Card title="Manage Agents" subtitle="View, create, and manage all registered agents" maxWidth="60rem">
      <div className="page-header">
        <button className="primary-button" onClick={() => navigate('/add-agent')}>
          Add New Agent
        </button>
      </div>
      <div className="table-container">
        {isLoading ? (
          <p>Loading Agents...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Tasks Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents && agents.length > 0 ? (
                agents.map((agent) => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone}</td>
                    <td style={{ textAlign: 'center' }}>
                      {taskCounts[agent._id] || 0}
                    </td>
                    <td>
                      <button 
                        className="primary-button" 
                        onClick={() => navigate(`/agent-details/${agent._id}`)}
                      >
                      Action
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>
                    No agents found. Click "Add New Agent" to begin.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  );
};

export default ManageAgentsPage;