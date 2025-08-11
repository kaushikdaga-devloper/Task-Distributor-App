import React from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';

const AddNotes = ({ isOpen, onClose, agent, onNoteAdded }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { token } = useAuthState();

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data) => {
    try {
      // We will create a new task assigned to this agent
      const taskData = {
        ...data,
        assignedTo: agent._id,
      };
      // This POST request requires a new backend endpoint
      await axiosInstance.post('/tasks/create', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Note/Task added successfully!');
      onNoteAdded(); // This will close the modal and refresh data
    } catch (error) {
      alert('Failed to add note: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Note/Task for {agent.name}</h2>
          <button onClick={handleClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* The task schema requires a name and phone */}
            <div className="form-group">
              <label htmlFor="firstName">Contact First Name</label>
              <input id="firstName" {...register('firstName', { required: 'First Name is required' })} />
              {errors.firstName && <p className="error-message">{errors.firstName.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Contact Phone</label>
              <input id="phone" type="tel" {...register('phone', { required: 'Phone is required' })} />
              {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows="4" style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem'}} {...register('notes', { required: 'Notes are required' })} />
              {errors.notes && <p className="error-message">{errors.notes.message}</p>}
            </div>
            
            <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={handleClose}>Cancel</button>
                <button type="submit" className="primary-button">Save Note</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNotes;