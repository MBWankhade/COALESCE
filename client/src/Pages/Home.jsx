import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import 'tailwindcss/tailwind.css';

const Home = () => {
  const navigate = useNavigate();

  const handleJoinRoom = () =>{
    if( !localStorage.getItem('token') ){
      alert('Please LogIn');
      return;
    }
    navigate('/join-room');
  }
  const handleCreateRoom = () =>{
    if( !localStorage.getItem('token') ){
      alert('Please LogIn');
      return;
    }
    navigate("/create-room");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Coalesce</h1>
        <p className="text-lg text-gray-600">The platform where friends come together to share questions and chat.</p>
      </div>
      <div className="flex space-x-4 mb-8">
        <button onClick={handleJoinRoom} className="bg-blue hover:bg-blue text-white py-2 px-4 rounded-lg transition duration-300 focus:outline-none">Join Room</button>
        <button onClick={handleCreateRoom} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition duration-300 focus:outline-none">Create Room</button>

      </div>
      <div className="w-full bg-gray-100 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="">
          <li className="mb-2">Easy-to-use interface</li>
          <li className="mb-2">Real-time chat functionality</li>
          <li className="mb-2">Secure and private rooms</li>
          <li className="mb-2">Code editor with live preview</li>
        </ul>
      </div>
      <div className="w-full mt-8 bg-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Testimonials</h2>
        <p className="text-gray-600 mb-2">"Coalesce has made it incredibly easy for our group to stay connected and share important questions. The chat feature is especially helpful for quick discussions."</p>
        <p className="text-gray-600">- Ritish Guttedar</p>
      </div>
    </div>
  );
};

export default Home;
