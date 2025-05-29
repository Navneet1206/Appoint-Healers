import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Mock axios and toast for demonstration
const axios = {
  get: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (url.includes('/api/user/tests/')) {
      return {
        data: {
          success: true,
          test: {
            _id: '1',
            title: 'Sample Test',
            description: 'This is a sample test for demonstration',
            questions: [
              {
                questionText: 'What is 2 + 2?',
                options: [
                  { text: '3' },
                  { text: '4' },
                  { text: '5' },
                  { text: '6' }
                ]
              },
              {
                questionText: 'What is the capital of France?',
                options: [
                  { text: 'London' },
                  { text: 'Berlin' },
                  { text: 'Paris' },
                  { text: 'Madrid' }
                ]
              }
            ]
          }
        }
      };
    }
    
    return {
      data: {
        success: true,
        tests: [
          { _id: '1', category: 'Mathematics', subCategory: 'Basic Math', title: 'Basic Arithmetic', description: 'Test your basic math skills' },
          { _id: '2', category: 'Mathematics', subCategory: 'Algebra', title: 'Linear Equations', description: 'Solve linear equations' },
          { _id: '3', category: 'Science', subCategory: 'Physics', title: 'Motion and Force', description: 'Understanding physics concepts' },
          { _id: '4', category: 'Science', subCategory: 'Chemistry', title: 'Chemical Reactions', description: 'Basic chemistry principles' },
          { _id: '5', category: 'Language', subCategory: 'English', title: 'Grammar Test', description: 'Test your English grammar' },
          { _id: '6', category: 'Language', subCategory: 'Vocabulary', title: 'Word Knowledge', description: 'Expand your vocabulary' }
        ]
      }
    };
  },
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      data: {
        success: true,
        score: Math.floor(Math.random() * 100),
        resultText: 'Great job! You performed well on this test.'
      }
    };
  }
};

const toast = {
  error: (message) => console.error('Toast Error:', message),
  success: (message) => console.log('Toast Success:', message)
};

const Test = () => {
  const [tests, setTests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [userDetails, setUserDetails] = useState({ name: "", email: "", mobile: "" });

  // Fetch all tests on mount
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/tests`);
        if (data.success) {
          setTests(data.tests);
        }
      } catch (error) {
        toast.error("Error fetching tests");
        console.error("Fetch tests error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTests();
  }, []);

  // Get unique categories
  const categories = [...new Set(tests.map((test) => test.category))];

  // Get subcategories for the selected category
  const subCategories = selectedCategory
    ? [...new Set(tests
        .filter((test) => test.category === selectedCategory)
        .map((test) => test.subCategory))]
    : [];

  // Get tests for the selected subcategory
  const filteredTests = selectedSubCategory
    ? tests.filter(
        (test) =>
          test.category === selectedCategory &&
          test.subCategory === selectedSubCategory
      )
    : [];

  // Handle test selection
  const selectTest = async (testId) => {
    try {
      setTestLoading(true);
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/tests/${testId}`);
      if (data.success) {
        setSelectedTest(data.test);
        setAnswers(new Array(data.test.questions.length).fill(null));
        setResult(null);
      }
    } catch (error) {
      toast.error("Error fetching test details");
      console.error("Fetch test details error:", error);
    } finally {
      setTestLoading(false);
    }
  };

  // Handle answer selection
  const handleAnswer = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  // Submit test
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
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/submit-test`, {
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
      console.error("Submit test error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset functions
  const resetToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedTest(null);
    setAnswers([]);
    setResult(null);
  };

  const resetToSubCategories = () => {
    setSelectedSubCategory(null);
    setSelectedTest(null);
    setAnswers([]);
    setResult(null);
  };

  // Loading Spinner Component
  const LoadingSpinner = ({ size = "large", text = "Loading..." }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-[#D20424] ${
        size === "large" ? "h-16 w-16" : size === "medium" ? "h-12 w-12" : "h-8 w-8"
      }`}></div>
      <p className="mt-4 text-gray-600 font-medium">{text}</p>
    </div>
  );

  // Card Component
  const Card = ({ children, onClick, className = "", hover = true }) => (
    <motion.div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 ${
        hover ? "hover:shadow-xl hover:scale-105 hover:border-[#D20424]/20" : ""
      } ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : {}}
    >
      {children}
    </motion.div>
  );

  // Breadcrumb Component
  const Breadcrumb = () => (
    <nav className="mb-8">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <button 
          onClick={resetToCategories}
          className="hover:text-[#D20424] transition-colors"
        >
          Categories
        </button>
        {selectedCategory && (
          <>
            <span>/</span>
            <button 
              onClick={resetToSubCategories}
              className="hover:text-[#D20424] transition-colors"
            >
              {selectedCategory}
            </button>
          </>
        )}
        {selectedSubCategory && (
          <>
            <span>/</span>
            <span className="text-[#D20424] font-medium">{selectedSubCategory}</span>
          </>
        )}
      </div>
    </nav>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner text="Loading tests..." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Assessment Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover your potential through our comprehensive testing platform
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D20424] to-pink-400 mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Breadcrumb */}
        {(selectedCategory || selectedSubCategory) && <Breadcrumb />}

        <AnimatePresence mode="wait">
          {/* Category View */}
          {!selectedCategory && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Category</h2>
                <p className="text-gray-600 text-lg">Select a category to explore available assessments</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <Card
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="p-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#D20424]/10 to-[#D20424]/20 rounded-2xl mb-6 flex items-center justify-center">
                        <div className="w-8 h-8 bg-[#D20424] rounded-lg"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{category}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Explore comprehensive assessments in {category.toLowerCase()}
                      </p>
                      <div className="mt-6 flex items-center text-[#D20424] font-semibold">
                        <span>Explore Tests</span>
                        <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Subcategory View */}
          {selectedCategory && !selectedSubCategory && (
            <motion.div
              key="subcategories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedCategory}</h2>
                <p className="text-gray-600 text-lg">Choose a specialized area within {selectedCategory}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {subCategories.map((subCategory) => (
                  <Card
                    key={subCategory}
                    onClick={() => setSelectedSubCategory(subCategory)}
                  >
                    <div className="p-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mb-6 flex items-center justify-center">
                        <div className="w-6 h-6 bg-blue-500 rounded-md"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{subCategory}</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Specialized assessments in {subCategory.toLowerCase()}
                      </p>
                      <div className="mt-6 flex items-center text-blue-600 font-semibold">
                        <span>View Tests</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Test List View */}
          {selectedSubCategory && !selectedTest && (
            <motion.div
              key="tests"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedSubCategory} Tests</h2>
                <p className="text-gray-600 text-lg">Select an assessment to begin</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTests.map((test) => (
                  <Card
                    key={test._id}
                    onClick={() => selectTest(test._id)}
                  >
                    <div className="p-8">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-6 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{test.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">{test.description}</p>
                      <div className="flex items-center text-green-600 font-semibold">
                        <span>Start Test</span>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Test Taking View */}
          {selectedTest && (
            <motion.div
              key="test-taking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {testLoading ? (
                <LoadingSpinner text="Loading test..." />
              ) : (
                <div className="max-w-4xl mx-auto">
                  <Card hover={false} className="p-8">
                    {/* Test Header */}
                    <div className="mb-8 pb-6 border-b border-gray-200">
                      <h2 className="text-3xl font-bold text-gray-800 mb-4">{selectedTest.title}</h2>
                      <p className="text-gray-600 text-lg leading-relaxed">{selectedTest.description}</p>
                    </div>

                    {/* User Details Form */}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={userDetails.name}
                            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D20424]/20 focus:border-[#D20424] transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                          <input
                            type="email"
                            placeholder="Enter your email"
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D20424]/20 focus:border-[#D20424] transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                          <input
                            type="tel"
                            placeholder="Enter your mobile"
                            value={userDetails.mobile}
                            onChange={(e) => setUserDetails({ ...userDetails, mobile: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D20424]/20 focus:border-[#D20424] transition-all"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-6">Test Questions</h3>
                      {selectedTest.questions.map((q, qIndex) => (
                        <motion.div
                          key={qIndex}
                          className="bg-gray-50 rounded-xl p-6"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: qIndex * 0.1 }}
                        >
                          <div className="flex items-start space-x-4 mb-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#D20424] text-white rounded-full flex items-center justify-center font-semibold">
                              {qIndex + 1}
                            </div>
                            <p className="text-lg font-medium text-gray-800 leading-relaxed">{q.questionText}</p>
                          </div>
                          
                          <div className="ml-12 space-y-3">
                            {q.options.map((option, oIndex) => (
                              <label 
                                key={oIndex} 
                                className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all ${
                                  answers[qIndex] === oIndex 
                                    ? 'bg-[#D20424]/10 border-2 border-[#D20424]' 
                                    : 'bg-white border-2 border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  checked={answers[qIndex] === oIndex}
                                  onChange={() => handleAnswer(qIndex, oIndex)}
                                  className="w-5 h-5 text-[#D20424] border-2 border-gray-300 focus:ring-[#D20424]/20"
                                />
                                <span className="text-gray-700 font-medium">{option.text}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Submit Button */}
                    <div className="mt-12 text-center">
                      <motion.button
                        onClick={submitTest}
                        disabled={isSubmitting}
                        className={`px-12 py-4 rounded-xl text-white font-semibold text-lg transition-all transform ${
                          isSubmitting 
                            ? "bg-gray-400 cursor-not-allowed scale-95" 
                            : "bg-[#D20424] hover:bg-[#B91C2C] hover:scale-105 shadow-lg hover:shadow-xl"
                        }`}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                      >
                        {isSubmitting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Calculating Results...</span>
                          </div>
                        ) : (
                          "Submit Test"
                        )}
                      </motion.button>
                    </div>

                    {/* Results */}
                    <AnimatePresence>
                      {result && (
                        <motion.div
                          className="mt-12 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200"
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-800 mb-4">Test Completed!</h3>
                            <div className="bg-white rounded-xl p-6 inline-block">
                              <p className="text-2xl font-bold text-[#D20424] mb-2">Your Score: {result.score}</p>
                              <p className="text-lg text-gray-700">{result.resultText}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Test;