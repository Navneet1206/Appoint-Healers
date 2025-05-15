import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Test = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const { data } = await axios.get("/api/user/tests");
        if (data.success) {
          setTests(data.tests);
        }
      } catch (error) {
        toast.error("Error fetching tests");
      }
    };
    fetchTests();
  }, []);

  const selectTest = async (testId) => {
    try {
      const { data } = await axios.get(`/api/user/tests/${testId}`);
      if (data.success) {
        setSelectedTest(data.test);
        setAnswers(new Array(data.test.questions.length).fill(null));
        setResult(null);
      }
    } catch (error) {
      toast.error("Error fetching test details");
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const submitTest = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.mobile) {
      toast.error("Please enter your name, email, and mobile number");
      return;
    }
    if (answers.some((ans) => ans === null)) {
      toast.error("Please answer all questions");
      return;
    }

    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const { data } = await axios.post("/api/user/submit-test", {
          name: userDetails.name,
          email: userDetails.email,
          mobile: userDetails.mobile,
          testId: selectedTest._id,
          answers,
        });
        if (data.success) {
          setResult(data);
        }
      } catch (error) {
        toast.error("Error submitting test");
      } finally {
        setIsSubmitting(false);
      }
    }, 5000); // 5-second delay
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold text-rose-600 mb-6 text-center">Take a Test</h1>
      {!selectedTest ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <motion.div
              key={test._id}
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => selectTest(test._id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl font-semibold">{test.title}</h2>
              <p className="text-gray-600">{test.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Category: {test.category} | Subcategory: {test.subCategory}
              </p>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{selectedTest.title}</h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              value={userDetails.mobile}
              onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          {selectedTest.questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6">
              <p className="text-lg font-medium mb-2">{q.questionText}</p>
              <div className="space-y-2">
                {q.options.map((option, oIndex) => (
                  <label key={oIndex} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answers[qIndex] === oIndex}
                      onChange={() => handleAnswer(qIndex, oIndex)}
                      className="form-radio text-rose-600"
                    />
                    <span>{option.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={submitTest}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold ${
              isSubmitting ? "bg-gray-400" : "bg-rose-600 hover:bg-rose-700"
            } transition`}
          >
            {isSubmitting ? "Calculating..." : "Submit Test"}
          </button>
          {isSubmitting && (
            <motion.div
              className="mt-4 text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <svg
                className="animate-spin h-8 w-8 mx-auto text-rose-600"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="mt-2">Calculating your results...</p>
            </motion.div>
          )}
          {result && (
            <motion.div
              className="mt-6 p-4 bg-rose-50 rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-semibold text-rose-600">Your Result</h3>
              <p className="text-lg">Score: {result.score}</p>
              <p className="text-lg">{result.resultText}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Test;