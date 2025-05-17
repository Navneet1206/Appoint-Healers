import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    expirationDate: new Date(),
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/coupons`, {
        headers: { aToken: localStorage.getItem("aToken") },
      });
      if (data.success) setCoupons(data.coupons);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, expirationDate: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { code, discountPercentage, expirationDate } = formData;
    if (!code || !discountPercentage || !expirationDate) {
      toast.error("All fields are required");
      return;
    }
    const discountNum = parseFloat(discountPercentage);
    if (isNaN(discountNum) || discountNum < 0 || discountNum > 100) {
      toast.error("Discount percentage must be between 0 and 100");
      return;
    }
    if (new Date(expirationDate) <= new Date()) {
      toast.error("Expiration date must be in the future");
      return;
    }

    try {
      if (isEditing) {
        const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/coupons/${editingCouponId}`,
          formData,
          { headers: { aToken: localStorage.getItem("aToken") } }
        );
        if (data.success) {
          toast.success("Coupon updated successfully");
          resetForm();
          fetchCoupons();
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/coupons`,
          formData,
          { headers: { aToken: localStorage.getItem("aToken") } }
        );
        if (data.success) {
          toast.success("Coupon created successfully");
          resetForm();
          fetchCoupons();
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const startEditing = (coupon) => {
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      expirationDate: new Date(coupon.expirationDate),
    });
    setIsEditing(true);
    setEditingCouponId(coupon._id);
  };

  const resetForm = () => {
    setFormData({ code: "", discountPercentage: "", expirationDate: new Date() });
    setIsEditing(false);
    setEditingCouponId(null);
  };

  const deleteCoupon = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        const { data } = await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/coupons/${id}`,
          { headers: { aToken: localStorage.getItem("aToken") } }
        );
        if (data.success) {
          toast.success("Coupon deleted successfully");
          fetchCoupons();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to delete coupon");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Coupon Management</h1>
      <div className="mb-6">
        <input
          type="text"
          name="code"
          value={formData.code}
          onChange={handleInputChange}
          placeholder="Coupon Code"
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          name="discountPercentage"
          value={formData.discountPercentage}
          onChange={handleInputChange}
          placeholder="Discount Percentage (0-100)"
          className="w-full p-2 mb-2 border rounded"
        />
        <DatePicker
          selected={formData.expirationDate}
          onChange={handleDateChange}
          showTimeSelect
          dateFormat="Pp"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          {isEditing ? "Update Coupon" : "Create Coupon"}
        </button>
        {isEditing && (
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white p-2 rounded w-full mt-2"
          >
            Cancel
          </button>
        )}
      </div>
      <h2 className="text-xl font-bold mb-2">Existing Coupons</h2>
      <ul>
        {coupons.map((coupon) => (
          <li
            key={coupon._id}
            className="flex justify-between items-center border p-2 mb-2 rounded"
          >
            <span>
              {coupon.code} - {coupon.discountPercentage}% - Expires:{" "}
              {new Date(coupon.expirationDate).toLocaleString()}
            </span>
            <div>
              <button
                onClick={() => startEditing(coupon)}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCoupon(coupon._id)}
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

export default CouponManagement;