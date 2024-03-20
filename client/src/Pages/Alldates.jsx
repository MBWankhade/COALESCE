import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const backendURL = 'https://coalesce-sos6.onrender.com';

const Alldates = () => {
  const [dates, setDates] = useState([]);
  const { roomCode } = useParams();

  // Function to format date as "23 March 2023" along with the day
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    fetch(`${backendURL}/getAllDates/${roomCode}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then((response) => response.json())
      .then((data) => setDates(data.data))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">List of All Dates</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {dates.map((date) => (
          <li key={date} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
            <Link to={`/Alldates/${date}/${roomCode}`} className="text-blue-500 hover:text-blue-700">
              {formatDate(date)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alldates;
