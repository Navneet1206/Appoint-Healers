import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipLoader } from 'react-spinners';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const Test = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 for name/phone, 0+ for questions
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  const questions = [
    {
      id: 'q1',
      text: 'How often do you feel stressed or overwhelmed?',
      options: ['Never', 'Sometimes', 'Often', 'Always'],
    },
    {
      id: 'q2',
      text: 'Do you have trouble sleeping due to worry or restlessness?',
      options: ['Yes', 'No'],
    },
    {
      id: 'q3',
      text: 'How would you describe your mood over the past two weeks?',
      options: ['Very positive', 'Somewhat positive', 'Neutral', 'Somewhat negative', 'Very negative'],
    },
    {
      id: 'q4',
      text: 'Do you feel anxious or uncomfortable in social situations?',
      options: ['Yes', 'No'],
    },
    {
      id: 'q5',
      text: 'Are you currently experiencing challenges in your relationships?',
      options: ['Yes', 'No'],
    },
  ];

  const totalSteps = questions.length + 1; // Name/phone + questions
  const currentStep = currentQuestion + 2; // -1 -> Step 1, 0 -> Step 2, etc.

  // Handle loading message sequence
  useEffect(() => {
    if (loading) {
      const messages = [
        'Parsing responses...',
        'Analyzing your answers...',
        'Finding the best professional for you...',
      ];
      let index = 0;
      setLoadingMessage(messages[0]);
      const interval = setInterval(() => {
        index = (index + 1) % messages.length;
        setLoadingMessage(messages[index]);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleNext = () => {
    if (currentQuestion === -1) {
      if (!name) {
        toast.error('Please enter your name.');
        return;
      }
      if (!phone || !/^\d{10}$/.test(phone)) {
        toast.error('Please enter a valid 10-digit mobile number.');
        return;
      }
    }
    // Only check for answer if not on the last question
    if (
      currentQuestion >= 0 &&
      currentQuestion < questions.length - 1 &&
      !answers[questions[currentQuestion].id]
    ) {
      toast.error('Please select an option.');
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > -1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if the last question has an answer
    if (!answers[questions[currentQuestion].id]) {
      toast.error('Please select an option.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/submit-test`, {
        name,
        phone,
        answers,
      });
      const { data } = response;
      if (data.success) {
        setLoading(false);
        setCompleted(true);
        setTimeout(() => navigate(`/appointment/${data.doctorId}`), 2000); // Delay for completion animation
      } else {
        toast.error(data.message || 'Failed to process test.');
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-4 md:p-8 pt-20 flex items-center justify-center relative overflow-hidden">
      {/* Subtle Background Animation */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-rose-100 to-rose-200 opacity-50"
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-3xl font-bold text-rose-600 mb-4 text-center">Mental Health Assessment</h1>
        <p className="text-gray-600 mb-8 text-center">
          Answer the following questions to receive personalized professional recommendations. No signup required.
        </p>

        {completed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <CheckCircleIcon className="h-16 w-16 text-rose-600 mb-4" />
            <p className="text-2xl text-rose-600 font-medium">Assessment Complete!</p>
            <p className="text-gray-600 mt-2">Redirecting to your recommended professional...</p>
          </motion.div>
        ) : loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-64"
          >
            <ClipLoader color="#e11d48" size={50} />
            <p className="mt-4 text-lg text-rose-600 font-medium">{loadingMessage}</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={currentQuestion === questions.length - 1 ? handleSubmit : undefined}
            className="bg-white p-6 rounded-lg shadow-md space-y-6"
          >
            {/* Progress Indicator */}
            <div className="mb-6">
              <p className="text-center text-gray-700 font-medium mb-2">
                Step {currentStep} of {totalSteps}
              </p>
              <div className="w-full bg-rose-200 rounded-full h-2">
                <motion.div
                  className="bg-rose-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {currentQuestion === -1 ? (
                <motion.div
                  key="personal-info"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full border border-rose-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      pattern="\d{10}"
                      placeholder="Enter 10-digit mobile number"
                      className="w-full border border-rose-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={questions[currentQuestion].id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <p className="font-medium text-gray-800">{questions[currentQuestion].text}</p>
                  <div className="space-y-2">
                    {questions[currentQuestion].options.map((option) => (
                      <motion.label
                        key={option}
                        className="flex items-center p-2 rounded-md cursor-pointer"
                        whileHover={{ scale: 1.02, backgroundColor: '#fef2f2' }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="radio"
                          name={questions[currentQuestion].id}
                          value={option}
                          checked={answers[questions[currentQuestion].id] === option}
                          onChange={(e) =>
                            setAnswers((prev) => ({ ...prev, [questions[currentQuestion].id]: e.target.value }))
                          }
                          required
                          className="mr-2 accent-rose-500"
                        />
                        <span className="text-gray-700">{option}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between">
              {currentQuestion > -1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                type={currentQuestion === questions.length - 1 ? 'submit' : 'button'}
                onClick={currentQuestion < questions.length - 1 ? handleNext : undefined}
                disabled={loading}
                className={`bg-rose-500 text-white py-2 px-4 rounded hover:bg-rose-600 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${currentQuestion > -1 ? '' : 'ml-auto'}`}
              >
                {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </div>
  );
};

export default Test;