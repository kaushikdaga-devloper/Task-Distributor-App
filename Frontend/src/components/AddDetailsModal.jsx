import React from 'react';

const AgentDetailsModal = ({ isOpen, onClose, agent, notes }) => {
  if (!isOpen || !agent) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agent Details</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <div className="agent-details-section">
            <h4>{agent.name}</h4>
            <p><strong>Email:</strong> {agent.email}</p>
            <p><strong>Phone:</strong> {agent.phone}</p>
          </div>

          <hr style={{ margin: '1.5rem 0' }} />

          <div className="agent-notes-section">
            <h4>Assigned Task Notes</h4>
            <div className="notes-list">
              {notes && notes.length > 0 ? (
                <ul>
                  {notes.map((note, index) => (
                    note && <li key={index}>{note}</li>
                  ))}
                </ul>
              ) : (
                <p>No notes found for this agent's tasks.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailsModal;