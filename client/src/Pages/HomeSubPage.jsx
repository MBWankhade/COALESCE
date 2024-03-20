import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiCalendar, FiEdit, FiSearch, FiPlus } from 'react-icons/fi'; // Import icons
import 'tailwindcss/tailwind.css';

const HomeSubPage = () => {
    const { roomCode } = useParams();
  const [funFact, setFunFact] = useState('');

  useEffect(() => {
    // Fetch a random fun fact related to questions or knowledge
    fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      .then(response => response.json())
      .then(data => setFunFact(data.text))
      .catch(error => console.error('Error fetching fun fact:', error));
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-8">Explore Questions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Link to={`/browse-questions/${roomCode}`} className="group block bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition duration-300">
    <FiCalendar className="text-4xl text-blue mb-4 mx-auto" />
    <h3 className="text-xl font-semibold mb-4 group-hover:text-blue transition duration-300">Browse Questions Date-wise</h3>
    <p className="text-gray-600">Discover what your friends have added date-wise.</p>
</Link>

        <Link to={`/friends/${roomCode}`} className="group block bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition duration-300">
          <FiEdit className="text-4xl text-blue mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue transition duration-300">Manage Your Questions</h3>
          <p className="text-gray-600">View and edit your posted questions.</p>
        </Link>
        <Link to={`/browse-questions/all-friends/${roomCode}`} className="group block bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition duration-300">
          <FiSearch className="text-4xl text-blue mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue transition duration-300">Browse Questions</h3>
          <p className="text-gray-600">Explore every question posted to date.</p>
        </Link>
        <Link to={`/add-question/${roomCode}`} className="group block bg-white rounded-lg shadow-md p-6 text-center hover:bg-gray-100 transition duration-300">
          <FiPlus className="text-4xl text-blue mb-4 mx-auto" />
          <h3 className="text-xl font-semibold mb-4 group-hover:text-blue transition duration-300">Add Questions</h3>
          <p className="text-gray-600">Contribute your own questions.</p>
        </Link>
      </div>
      <footer className="mt-12 text-center py-8 bg-white">
    <div className="max-w-4xl mx-auto">
        <p className="text-gray-700 mb-4 text-lg">Did you know? <br />{funFact}</p>
    </div>
</footer>


    </div>
  );
};

export default HomeSubPage;
