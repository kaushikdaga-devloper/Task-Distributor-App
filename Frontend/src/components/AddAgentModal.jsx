import React from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';

const AddAgentModal = ({ isOpen, onClose, onAgentAdded }) => {
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
      await axiosInstance.post('/agents', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Agent created successfully!');
      onAgentAdded(); // This will close the modal and refresh the agent list
    } catch (error) {
      alert('Failed to create agent: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Agent</h2>
          <button onClick={handleClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" {...register('name', { required: 'Name is required' })} />
              {errors.name && <p className="error-message">{errors.name.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" {...register('email', { required: 'Email is required' })} />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" {...register('phone', { required: 'Phone is required' })} />
              {errors.phone && <p className="error-message">{errors.phone.message}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={handleClose}>Cancel</button>
                <button type="submit" className="primary-button">Create Agent</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgentModal;