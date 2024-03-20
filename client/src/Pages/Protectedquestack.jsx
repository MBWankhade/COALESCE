import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const backendURL = 'https://coalesce-sos6.onrender.com';

const Protectedquestack = () => {
  const { date, roomCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteQuestion = async (questionId) => {
    try {
      await fetch(`${backendURL}/deleteQuestion/${questionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question._id !== questionId)
      );
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${backendURL}/friend/getAllQuestions/${roomCode}?date=${date}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setQuestions(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [roomCode, date]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Questions Added By You on {date}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {questions.slice().reverse().map((questionData, index) => (
            <div key={index} className="my-4 border border-gray-200 rounded-md p-4">
              <div className="text-lg font-semibold mb-4 text-gray-800">{questionData.question}</div>
              <div className="mt-2 space-y-2">
                {questionData.options.filter(option => option.trim() !== '').map((option, idx) =>(
                  <div key={idx} className="flex items-center">
                    <input type='radio' id={`option${index}_${idx}`} name={`options_${index}`} className="mr-2" />
                    <label htmlFor={`option${index}_${idx}`} className="text-gray-600">{option}</label>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-4"
                  onClick={() => {
                    const fileInfo = questionData.imageSolution;
                    const pdfBuffer = fileInfo.buffer.data;
                    const blob = new Blob([Uint8Array.from(pdfBuffer)], { type: fileInfo.mimetype });
                    const url = window.URL.createObjectURL(blob);
                    const newWindow = window.open(url, '_blank');
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  View Solution PDF
                </button>
                <button onClick={() => handleDeleteQuestion(questionData._id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Protectedquestack;
