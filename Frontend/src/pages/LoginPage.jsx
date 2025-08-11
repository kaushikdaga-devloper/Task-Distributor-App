import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuthDispatch } from '../store/AuthContext';
import Card from '../components/Card'; // Import the new Card component

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/login', data); //
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      navigate('/dashboard');
    } catch (error) {
      alert('Login Failed: Invalid email or password.');
    }
  };

  return (
    <Card title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: true })}
            placeholder="you@example.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: true })}
            placeholder="••••••••"
          />
        </div>
        
        <button type="submit" className="primary-button">
          Sign In
        </button>
      </form>
    </Card>
  );
};

export default LoginPage;