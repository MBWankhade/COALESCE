import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const backendURL = 'https://coalesce-sos6.onrender.com';

const Admins = () => {
  const [friends, setFriends] = useState([]);
  const { roomCode } = useParams();

  useEffect(() => {
    fetch(`${backendURL}/getAllFriends/${roomCode}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setFriends(data.data);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="header">
        <h2 className="text-2xl font-bold">List of Friends</h2>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {friends.map((friend) => (
          <li key={friend._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition duration-300">
            <Link to={`/friends/${roomCode}/${friend._id}/${friend.firstName}`} className="text-blue-500 hover:text-blue-700">
              {friend.firstName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Admins;
