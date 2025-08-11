import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';
import Card from '../components/Card';

const AgentDetailsPage = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthState();
  
  const [agent, setAgent] = useState(null);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true); // Separate loading state for notes

  const fetchDetails = useCallback(async () => {
    if (!token || !agentId) {
      setIsLoading(false);
      return;
    }

    // --- Step 1: Fetch the main agent details first ---
    try {
      const agentResponse = await axiosInstance.get(`/agents/${agentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (agentResponse && agentResponse.data) {
        setAgent(agentResponse.data);
      }
    } catch (error) {
      console.error("Critical error fetching agent details:", error);
      alert("Could not load agent details. The agent may not exist or the server is not responding.");
      navigate('/manage-agents');
    } finally {
      // Main page loading is finished once the agent details are fetched
      setIsLoading(false);
    }

    // --- Step 2: Fetch the task notes separately ---
    try {
      const tasksResponse = await axiosInstance.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (tasksResponse && Array.isArray(tasksResponse.data)) {
        const agentNotes = tasksResponse.data
          .filter(task => task.assignedTo?._id === agentId && task.notes)
          .map(task => task.notes);
        setNotes(agentNotes);
      }
    } catch (error) {
      console.error("Could not fetch task notes:", error);
      // We don't alert or navigate away, just show an error for the notes section
    } finally {
      setNotesLoading(false);
    }

  }, [token, agentId, navigate]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  // Main loading state for the whole page
  if (isLoading) {
    return <Card title="Loading Agent Details..."><p>Loading...</p></Card>;
  }

  // State if the agent could not be found
  if (!agent) {
    return <Card title="Error"><p>Agent details could not be loaded.</p></Card>;
  }

  // The final display
  return (
    <Card title="Agent Details" subtitle={`Information and notes for ${agent.name}`}>
      <div className="agent-details-section">
        <h4>{agent.name}</h4>
        <p><strong>Email:</strong> {agent.email}</p>
        <p><strong>Phone:</strong> {agent.phone}</p>
      </div>

      <hr style={{ margin: '1.5rem 0' }} />

      <div className="agent-notes-section">
        <h4>Assigned Task Notes</h4>
        <div className="notes-list">
          {notesLoading ? (
            <p>Loading notes...</p>
          ) : notes.length > 0 ? (
            <ul>
              {notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          ) : (
            <p>No notes found for this agent's tasks.</p>
          )}
        </div>
      </div>
      <button 
        className="primary-button" 
        style={{marginTop: '2rem'}} 
        onClick={() => navigate('/manage-agents')}
      >
        Back to Agent List
      </button>
    </Card>
  );
};

export default AgentDetailsPage;