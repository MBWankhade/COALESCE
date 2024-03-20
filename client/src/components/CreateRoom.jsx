import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom"; // For navigation
import "tailwindcss/tailwind.css";
import { FaRegCopy } from "react-icons/fa";

const CreateRoom = () => {
  const [groupName, setGroupName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [showCode, setShowCode] = useState(false); // Add state to control when to show the code
  const [showCreateRoom, setShowCreateRoom] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (groupName.trim() === "") {
      setError("Group name cannot be empty!");
      return;
    }
    try {
        fetch(`https://coalesce-sos6.onrender.com/create-room`, {
          method: 'POST',
          body: JSON.stringify({ groupName }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          if (response.status === 201) {
            return response.json(); // Parse response body as JSON
          } else if (response.status === 403) {
            throw new Error('Unauthorized'); // Throw an error for 403 status
          } else {
            throw new Error('Failed to create room'); // Throw an error for other statuses
          }
        })
        .then(data => {
          console.log(data); // Log the response data
          setRoomCode(data.room.roomCode);
          setShowCode(true);
          setShowCreateRoom(false);
          window.alert("You have successfully created room!");
        })
        .catch(error => {
          console.error("Error occurred while creating room", error);
          window.alert("An error occurred while creating room");
        });
      } catch (error) {
        console.error("Error occurred while creating room", error);
      }
      
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied to clipboard!");
};


  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {showCreateRoom && (
        <>
          <h1 className="text-4xl font-bold mb-4">Create a Room</h1>
          <input
            type="text"
            placeholder="Enter Group Name"
            value={groupName}
            onChange={(e) => {
              setGroupName(e.target.value);
              setError("");
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleCreateRoom}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 mb-4"
          >
            Generate Room Code
          </button>
        </>
      )}
      {showCode && (
  <div className="bg-gray-100 p-4 rounded-lg text-center w-full">
    <h2 className="text-lg font-bold mb-2">
      Share this code with your friends:
    </h2>
    <div className="flex items-center justify-center">
      <p className="text-2xl font-bold text-gray-900">{roomCode}</p>
      <span className="ml-2">
        <FaRegCopy onClick={handleCopyCode} className="copy-button"/>
      </span>
    </div>

    <div className="mt-4 space-x-4">
        <Link to={`/enter-room/${roomCode}`}>
        <button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Enter Room
        </button>
        </Link>
      <a href="/">
      <button 
        onclick = {()=>{
            navigate('/');
        }}
        className="bg-blue hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Back to Home
      </button>
      </a>
      
    </div>
  </div>
)}

    </div>
  );
};

export default CreateRoom;
