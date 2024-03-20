import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi'; // Importing an arrow icon from react-icons library

const EnterRoom = () => {
  const [roomData, setRoomData] = useState([]);
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [isInputValid, setIsInputValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch(`https://coalesce-sos6.onrender.com/get-rooms`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.status === 200) {
          const data = await response.json();
          setRoomData(data.roomData);
        } else if (response.status === 404) {
          throw new Error('Unauthorized');
        } else {
          throw new Error('Failed to get rooms');
        }
      } catch (error) {
        console.error('Error occurred while fetching rooms', error);
      }
    };
    fetchRooms();
  }, []);

  const handleInputChange = event => {
    const value = event.target.value;
    setInputRoomCode(value);
    setIsInputValid(value.trim().length > 0);
  };

  const handleJoinRoom = async () => {
    const roomCode = inputRoomCode;
    try {
      const response = await fetch(`https://coalesce-sos6.onrender.com/ifRoomExists/${roomCode}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      const data = await response.json();
      if (response.ok) {
        if (data.exists) {
          navigate(`/enter-room/${inputRoomCode}`);
        } else {
          alert("Invalid Code! Please enter a valid code.");
          console.log('Room does not exist');
        }
      } 
      else if (response.status === 400) {
        if (data.exists) {
          navigate(`/enter-room/${inputRoomCode}`);
        } else {
          alert("Invalid Code! Please enter a valid code.");
          console.log('Room does not exist');
        }
      } else {
        console.log('Failed to fetch room information:', data.error);
      }
    } catch (error) {
      console.error('Error occurred while fetching room information:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-lg">
      <h1 className="text-3xl font-semibold mb-8">My Groups</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roomData.map((room, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300">
            <Link to={`/enter-room/${room.roomCode}`} className="block text-green hover:underline hover:text-green-700 transition duration-300">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xl">{room.groupName}</span>
                <FiArrowRight className="w-6 h-6 text-gray-500" />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row md:items-center mt-8">
        <input
          type="text"
          placeholder="Enter Room Code"
          value={inputRoomCode}
          onChange={handleInputChange}
          className="w-full md:w-auto p-4 border border-gray-300 rounded-lg mb-4 md:mb-0 mr-0 md:mr-4 focus:outline-none focus:border-green-500 text-lg"
        />
        <button
          onClick={handleJoinRoom}
          className={`w-full md:w-auto bg-green-500 text-white px-6 py-4 rounded-lg hover:bg-green-600 focus:outline-none ${isInputValid ? '' : 'opacity-50 cursor-not-allowed'}`}
          disabled={!isInputValid}
        >
          Join Room
        </button>
      </div>
    </div>
  );
};

export default EnterRoom;
