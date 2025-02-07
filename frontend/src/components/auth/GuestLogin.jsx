import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { loginSuccess } from '../../features/auth/authSlice';
import api from '../../services/api';

const GuestLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/guest-login');
      dispatch(loginSuccess(response.data));
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Guest login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <Button
        variant="secondary"
        onClick={handleGuestLogin}
        isLoading={isLoading}
        className="w-full"
      >
        Continue as Guest
      </Button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default GuestLogin; 