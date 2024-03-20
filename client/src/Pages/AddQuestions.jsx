import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const backendURL = 'https://coalesce-sos6.onrender.com';

const AddQuestions = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [solutionPdf, setSolutionPdf] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const { roomCode } = useParams();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSolutionPdf(file);
      setSelectedFileName(file.name);
    } else {
      alert('Please select a valid PDF file.');
      e.target.value = null;
    }
  };

  const handleFileButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('question', question);
    options.forEach((element, index) => {
      formData.append(`options[${index}]`, element);
    });
    formData.append('imageSolution', solutionPdf);

    fetch(`${backendURL}/addQuestion/${roomCode}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response:', data);
        alert('Question Added Successfully');
      })
      .catch(error => {
        console.error('Error:', error);
      });

    console.log('Submitted:', { question, options, solutionPdf });
  };

  return (
    <div className="container mx-auto mt-10">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-md">
        <h1 className="text-3xl text-center text-indigo-700 mb-6">Add Question</h1>

        <div className="mb-4">
          <label htmlFor="question" className="block text-gray-700">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <p className="text-indigo-700 mb-2">Options:</p>
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="fileInput" className="block text-gray-700">Solution PDF</label>
          <input
            id="fileInput"
            type="file"
            onChange={handlePdfChange}
            accept=".pdf"
            className="hidden"
          />
          <button
            type="button"
            onClick={handleFileButtonClick}
            className="bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800"
          >
            Choose File
          </button>
          <p className="text-gray-500 mt-2">{selectedFileName}</p>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-700 text-white py-2 rounded-md hover:bg-indigo-800"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddQuestions;
