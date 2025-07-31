// DashboardPage.jsx
import { useAuthDispatch } from '../store/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance.jsx';
import AddAgentForm from '../features/agents/AddAgentForm.jsx';
import FileUpload from '../features/tasks/FileUpload.jsx';
import TaskDisplay from '../features/tasks/TaskDisplay.jsx';
import '../index.css'; // Import the CSS file

const fetchAgents = async () => (await axiosInstance.get('/agents')).data;
const fetchTasks = async () => (await axiosInstance.get('/tasks')).data;
const deleteTask = async (taskId) => (await axiosInstance.delete(`/tasks/${taskId}`)).data;

const DashboardPage = () => {
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: agents, isLoading: agentsLoading } = useQuery({ 
    queryKey: ['agents'], 
    queryFn: fetchAgents 
  });
  
  const { data: tasks, isLoading: tasksLoading } = useQuery({ 
    queryKey: ['tasks'], 
    queryFn: fetchTasks 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      alert('Task deleted successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.response?.data?.error || 'Could not delete task.'}`);
    },
  });

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/login');
  };

  const isLoading = agentsLoading || tasksLoading;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Create New Agent</h3>
          </div>
          <AddAgentForm />
        </div>
        
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Upload Task File</h3>
          </div>
          <FileUpload />
        </div>
      </div>
      
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Distributed Tasks</h2>
        </div>
        {isLoading ? (
          <div className="loading-indicator">Loading tasks...</div>
        ) : (
          <TaskDisplay 
            agents={agents || []} 
            tasks={tasks || []} 
            onDelete={deleteMutation.mutate}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;