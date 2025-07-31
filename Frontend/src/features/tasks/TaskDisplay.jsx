const TaskDisplay = ({ agents, tasks, onDelete }) => {
  const handleDelete = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(taskId);
    }
  };

  if (!agents || agents.length === 0) {
    return <p>No agents available to display tasks for.</p>;
  }

  return (
    <div className="task-grid">
      {agents.map((agent) => {
        const agentTasks = tasks?.filter((task) => task.assignedTo?._id === agent._id) || [];
        
        return (
          <div className="task-card" key={agent._id}>
            <div className="task-card-header">
              <h3>{agent.name}</h3>
              <p style={{ fontSize: '0.8rem', color: '#718096' }}>{agent.email}</p>
            </div>
            <div className="task-card-body">
              {agentTasks.length > 0 ? (
                agentTasks.map((task) => (
                  <div key={task._id} style={{ backgroundColor: '#f7fafc', padding: '0.5rem', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 'bold' }}>{task.firstName}</p>
                      <p>Phone: {task.phone}</p>
                      {task.notes && <p style={{ fontSize: '0.8rem' }}>Notes: {task.notes}</p>}
                    </div>
                    <button onClick={() => handleDelete(task._id)} style={{ backgroundColor: '#e53e3e', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: '#a0aec0' }}>No tasks assigned.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskDisplay;