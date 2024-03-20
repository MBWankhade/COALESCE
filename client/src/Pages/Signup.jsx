import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Assuming your backend endpoint for email verification is /register
      const response = await axios.post('https://coalesce-sos6.onrender.com/register', {
        email,
        firstName,
        lastName,
      });

      if (response.status === 200) {
        setShowOtpInput(true);
      } else {
        setError('Enter valid information');
      }
    } catch (err) {
      console.error('Error verifying email:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Assuming your backend endpoint for OTP verification is /verifyOtp
      const response = await axios.post('https://coalesce-sos6.onrender.com/verify-otp', {
        email,
        otp,
      });
      if (response.status === 200) {
          // Handle successful signup
        localStorage.setItem('token', response.data.token);
        navigate('/set-password');
        console.log('Signup successful!');
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Signup</h2>
        {!showOtpInput ? (
          <form onSubmit={handleEmailSubmit}>
            {/* Add additional input fields */}
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue"
                required
              />
            </div>
            {/* Add Terms and Conditions checkbox */}
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={() => setTermsChecked(!termsChecked)}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-700">
                  By signing up, you agree to our Terms and Conditions.
                </span>
              </label>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue text-white p-2 rounded-md hover:bg-primary focus:outline-none focus:bg-primary"
              disabled={loading || !termsChecked}
            >
              {loading ? 'Sending OTP...' : 'Verify Email'}
            </button>
            <p className="mt-2 text-sm text-gray-600">
              Already registered? <Link to="/login">Login</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700 text-sm font-bold mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
