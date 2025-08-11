import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Card from '../components/Card';

const RegisterPage = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axiosInstance.post('/auth/register', data); //
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration Failed: ' + (error.response?.data?.message || 'Server error'));
    }
  };

  return (
    <Card title="Create an Account" subtitle="Get started by creating a new admin account.">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" {...register('email', { required: true })} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" {...register('password', { required: true })} />
        </div>
        <button type="submit" className="primary-button">Register</button>
      </form>
    </Card>
  );
};

export default RegisterPage;