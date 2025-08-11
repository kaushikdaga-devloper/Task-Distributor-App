import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';
import Card from '../components/Card';
import AddAgentModal from '../components/AddAgentModal';
import AgentNotesModal from '../components/AgentNotesModal'; // Ensure correct import

const ManageAgentsPage = () => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);

  const { token } = useAuthState();

  // Fetch data function
  const fetchData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch agents
      const agentsRes = await axiosInstance.get('/agents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle agents response
      const agentsData = Array.isArray(agentsRes?.data) ? agentsRes.data : [];
      setAgents(agentsData);
      console.log('Fetched agents:', agentsData); // Debug log

      // Fetch tasks
      const tasksRes = await axiosInstance.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Handle tasks response
      const tasksData = Array.isArray(tasksRes?.data) ? tasksRes.data : [];
      setTasks(tasksData);

      // Calculate task counts per agent
      const counts = {};
      tasksData.forEach(task => {
        const agentId = task.assignedTo?._id;
        if (agentId) {
          counts[agentId] = (counts[agentId] || 0) + 1;
        }
      });
      setTaskCounts(counts);
      
    } catch (error) {
      console.error('Fetch error:', error);
      setAgents([]);
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount and token change
  useEffect(() => {
    fetchData();
  }, [token]);

  // Add new agent handler
  const handleAddAgent = async (data) => {
    try {
      await axiosInstance.post('/agents', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsAddModalOpen(false);
      fetchData(); // Refresh data
      alert('Agent created successfully!');
    } catch (error) {
      alert(`Failed to create agent: ${error.response?.data?.error || 'Server error'}`);
    }
  };

  // Open notes modal for an agent
  const handleViewNotes = (agent) => {
    setSelectedAgent(agent);
    setIsNotesModalOpen(true);
  };

  // Get notes for the selected agent
  const getNotesForAgent = () => {
    if (!selectedAgent || !tasks) return [];
    return tasks
      .filter(task => 
        task.assignedTo?._id === selectedAgent._id && 
        task.notes
      )
      .map(task => task.notes);
  };

  return (
    <>
      {/* Add Agent Modal */}
      <AddAgentModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAgentAdded={handleAddAgent}
      />
      
      {/* Agent Notes Modal */}
      <AgentNotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        agentName={selectedAgent?.name || 'Agent'}
        notes={getNotesForAgent()}
      />
      
      {/* Main Content */}
      <Card 
        title="Manage Agents" 
        subtitle="View, create, and manage all registered agents" 
        maxWidth="60rem"
      >
        <div className="page-header">
          <button 
            className="primary-button" 
            onClick={() => setIsAddModalOpen(true)}
          >
            Add New Agent
          </button>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <p>Loading agents...</p>
          ) : agents.length > 0 ? (
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
                {agents.map(agent => (
                  <tr key={agent._id}>
                    <td>{agent.name}</td>
                    <td>{agent.email}</td>
                    <td>{agent.phone}</td>
                    <td>{taskCounts[agent._id] || 0}</td>
                    <td>
                      <button 
                        className="action-button" 
                        onClick={() => handleViewNotes(agent)}
                      >
                        View Notes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No agents found.</p>
              <button 
                className="primary-button"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Your First Agent
              </button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default ManageAgentsPage;