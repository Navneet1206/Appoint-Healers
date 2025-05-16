import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    questions: [{ questionText: "", options: [{ text: "", points: 0 }] }],
    resultRanges: [{ minScore: 0, maxScore: 0, resultText: "" }],
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/admin/tests", {
        headers: { aToken: localStorage.getItem("aToken") },
      });
      if (data.success) setTests(data.tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Failed to fetch tests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending request to:', 'http://localhost:4000/api/admin/add-test');
      console.log('With data:', formData);
      const { data } = await axios.post("http://localhost:4000/api/admin/add-test", formData, {
        headers: { aToken: localStorage.getItem("aToken") },
      });
      if (data.success) {
        toast.success("Test added successfully");
        fetchTests();
        setFormData({
          title: "",
          description: "",
          category: "",
          subCategory: "",
          questions: [{ questionText: "", options: [{ text: "", points: 0 }] }],
          resultRanges: [{ minScore: 0, maxScore: 0, resultText: "" }],
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Failed to add test");
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: "", options: [{ text: "", points: 0 }] }],
    });
  };

  const addOption = (questionIndex) => {
    const questions = [...formData.questions];
    questions[questionIndex].options.push({ text: "", points: 0 });
    setFormData({ ...formData, questions });
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const questions = [...formData.questions];
    if (questions[questionIndex].options.length > 1) {
      questions[questionIndex].options = questions[questionIndex].options.filter(
        (_, index) => index !== optionIndex
      );
      setFormData({ ...formData, questions });
    } else {
      toast.error("Each question must have at least one option");
    }
  };

  const addResultRange = () => {
    setFormData({
      ...formData,
      resultRanges: [...formData.resultRanges, { minScore: 0, maxScore: 0, resultText: "" }],
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Subcategory"
          value={formData.subCategory}
          onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
          className="w-full p-2 border rounded"
        />

        {formData.questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded">
            <input
              type="text"
              placeholder="Question Text"
              value={q.questionText}
              onChange={(e) => {
                const questions = [...formData.questions];
                questions[qIndex].questionText = e.target.value;
                setFormData({ ...formData, questions });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            {q.options.map((opt, oIndex) => (
              <div key={oIndex} className="flex space-x-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt.text}
                  onChange={(e) => {
                    const questions = [...formData.questions];
                    questions[qIndex].options[oIndex].text = e.target.value;
                    setFormData({ ...formData, questions });
                  }}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Points"
                  value={opt.points}
                  onChange={(e) => {
                    const questions = [...formData.questions];
                    questions[qIndex].options[oIndex].points = Number(e.target.value);
                    setFormData({ ...formData, questions });
                  }}
                  className="w-24 p-2 border rounded"
                />
                {q.options.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteOption(qIndex, oIndex)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(qIndex)}
              className="bg-blue-500 text-white p-2 rounded mb-2"
            >
              Add Option
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Question
        </button>

        {formData.resultRanges.map((r, idx) => (
          <div key={idx} className="border p-4 rounded">
            <input
              type="number"
              placeholder="Min Score"
              value={r.minScore}
              onChange={(e) => {
                const resultRanges = [...formData.resultRanges];
                resultRanges[idx].minScore = Number(e.target.value);
                setFormData({ ...formData, resultRanges });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="number"
              placeholder="Max Score"
              value={r.maxScore}
              onChange={(e) => {
                const resultRanges = [...formData.resultRanges];
                resultRanges[idx].maxScore = Number(e.target.value);
                setFormData({ ...formData, resultRanges });
              }}
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Result Text"
              value={r.resultText}
              onChange={(e) => {
                const resultRanges = [...formData.resultRanges];
                resultRanges[idx].resultText = e.target.value;
                setFormData({ ...formData, resultRanges });
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addResultRange}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Result Range
        </button>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Add Test
        </button>
      </form>

      <h2 className="text-xl font-bold mt-6">Existing Tests</h2>
      <ul>
        {tests.map((test) => (
          <li key={test._id} className="border p-2 my-2 rounded">
            {test.title} - {test.category} - {test.subCategory}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestManagement;