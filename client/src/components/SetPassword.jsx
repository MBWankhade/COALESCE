import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetPassword = () => {
    const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validatePassword(password)) {
      setError(
        'Password must contain at least one lowercase letter, one uppercase letter, one symbol, one number, and have a minimum length of 8 characters.'
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
        const email = localStorage.getItem('email');
        const headers = {Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',}
      // Add your backend endpoint for handling password setup
      const response = await axios.post('https://coalesce-sos6.onrender.com/set-password', {
        email,
        password,
      },{headers});

      if (response.status === 200) {
        // Handle successful password setup, e.g., navigate to another page
        console.log('Password setup successful!');
        navigate('/')
      } else {
        setError('Failed to set up password. Please try again.');
      }
    } catch (err) {
      console.error('Error setting up password:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Set Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue text-white p-2 rounded-md hover:bg-primary focus:outline-none focus:bg-primary"
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Set Up Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
