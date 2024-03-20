import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ handleLogin, closeLoginPopup }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('https://coalesce-sos6.onrender.com/user/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        handleLogin();
        closeLoginPopup();
        navigate('/');
        console.log('Login successful!');
      } else {
        console.log(response.message);
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10 rounded-md shadow-md w-96">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-600">Login</h2>
      <form onSubmit={handleLoginSubmit}>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-600 text-sm font-semibold mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-blue-400 text-sm bg-gray-100"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-600 text-sm font-semibold mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:outline-none focus:border-blue-400 text-sm bg-gray-100"
            required
          />
        </div>
        {error && <p className="text-red-500 mb-6 text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700 text-sm"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4">
        <button
          className="w-full py-2 px-5 border rounded bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:bg-gray-400 text-sm"
          onClick={closeLoginPopup}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Login;
