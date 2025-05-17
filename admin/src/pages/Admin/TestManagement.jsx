import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTestId, setEditingTestId] = useState(null);
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
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/tests`, {
        headers: { aToken: localStorage.getItem("aToken") },
      });
      if (data.success) setTests(data.tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      toast.error("Failed to fetch tests");
    }
  };

  const startEditing = (testId) => {
    const testToEdit = tests.find((test) => test._id === testId);
    if (testToEdit) {
      setFormData({
        title: testToEdit.title,
        description: testToEdit.description,
        category: testToEdit.category,
        subCategory: testToEdit.subCategory,
        questions: testToEdit.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options.map((opt) => ({ text: opt.text, points: opt.points })),
        })),
        resultRanges: testToEdit.resultRanges.map((r) => ({
          minScore: r.minScore,
          maxScore: r.maxScore,
          resultText: r.resultText,
        })),
      });
      setIsEditing(true);
      setEditingTestId(testId);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditingTestId(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      subCategory: "",
      questions: [{ questionText: "", options: [{ text: "", points: 0 }] }],
      resultRanges: [{ minScore: 0, maxScore: 0, resultText: "" }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/tests/${editingTestId}`,
          formData,
          {
            headers: { aToken: localStorage.getItem("aToken") },
          }
        );
        if (data.success) {
          toast.success("Test updated successfully");
          cancelEditing();
          fetchTests();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/add-test`,
          formData,
          {
            headers: { aToken: localStorage.getItem("aToken") },
          }
        );
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
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Failed to submit test");
    }
  };

  const deleteTest = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/tests/${testId}`,
          {
            headers: { aToken: localStorage.getItem("aToken") },
          }
        );
        if (data.success) {
          toast.success("Test deleted successfully");
          fetchTests();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error deleting test:", error);
        toast.error("Failed to delete test");
      }
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: "", options: [{ text: "", points: 0 }] }],
    });
  };

  const deleteQuestion = (questionIndex) => {
    if (formData.questions.length > 1) {
      const questions = formData.questions.filter((_, index) => index !== questionIndex);
      setFormData({ ...formData, questions });
    } else {
      toast.error("Each test must have at least one question");
    }
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

  const deleteResultRange = (rangeIndex) => {
    if (formData.resultRanges.length > 1) {
      const resultRanges = formData.resultRanges.filter((_, index) => index !== rangeIndex);
      setFormData({ ...formData, resultRanges });
    } else {
      toast.error("Each test must have at least one result range");
    }
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
                    Delete Option
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
            {formData.questions.length > 1 && (
              <button
                type="button"
                onClick={() => deleteQuestion(qIndex)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Remove Question
              </button>
            )}
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
            {formData.resultRanges.length > 1 && (
              <button
                type="button"
                onClick={() => deleteResultRange(idx)}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2"
              >
                Remove Result Range
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addResultRange}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Result Range
        </button>

        <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
          {isEditing ? "Update Test" : "Add Test"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={cancelEditing}
            className="bg-gray-500 text-white p-2 rounded w-full mt-2"
          >
            Cancel Editing
          </button>
        )}
      </form>

      <h2 className="text-xl font-bold mt-6">Existing Tests</h2>
      <ul>
        {tests.map((test) => (
          <li key={test._id} className="border p-2 my-2 rounded flex justify-between items-center">
            <span>{test.title} - {test.category} - {test.subCategory}</span>
            <div>
              <button
                onClick={() => startEditing(test._id)}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTest(test._id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestManagement;