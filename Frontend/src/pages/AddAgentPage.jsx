import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthState } from '../store/AuthContext';
import Card from '../components/Card';

const AddAgentPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { token } = useAuthState();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/agents', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Agent created successfully!');
      navigate('/manage-agents'); // Go back to the agent list after success
    } catch (error) {
      alert('Failed to create agent: ' + (error.response?.data?.error || 'Server error'));
    }
  };

  return (
    <Card title="Create New Agent" subtitle="Fill out the form below to add a new agent">
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
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="button" className="secondary-button" onClick={() => navigate('/manage-agents')}>
            Cancel
          </button>
          <button type="submit" className="primary-button" style={{width: '100%'}}>
            Create Agent
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AddAgentPage;