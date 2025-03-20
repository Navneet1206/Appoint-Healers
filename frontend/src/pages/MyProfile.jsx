import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const MyProfile = () => {
  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [upImg, setUpImg] = useState(null); // Uploaded image as Data URL
  const [crop, setCrop] = useState({ aspect: 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageRef, setImageRef] = useState(null);

  // Handle file selection; accept only images.
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setUpImg(reader.result);
        setPreviewUrl(reader.result);
      });
      reader.readAsDataURL(file);
    }
  };

  // Save image reference for cropping
  const onImageLoaded = (img) => {
    setImageRef(img);
    return false; // Required by ReactCrop
  };

  // When crop is complete, generate the cropped image blob.
  const onCropComplete = async (crop, pixelCrop) => {
    setCompletedCrop(crop);
    if (imageRef && crop.width && crop.height) {
      try {
        const blob = await getCroppedImg(imageRef, pixelCrop, "cropped.jpeg");
        setCroppedBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      } catch (e) {
        console.error("Crop failed", e);
      }
    }
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  // Utility function: get cropped image blob from canvas using pixelCrop.
  function getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          reject(new Error("Canvas is empty"));
          return;
        }
        blob.name = fileName;
        resolve(blob);
      }, "image/jpeg");
    });
  }

  // Function to update user profile data
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      if (croppedBlob) {
        formData.append("image", croppedBlob);
      }

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setUpImg(null);
        setPreviewUrl(null);
        setCroppedBlob(null);
        setCrop({ aspect: 1 });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="max-w-lg mx-auto flex flex-col gap-4 text-sm pt-5">
      {/* Profile Image & Upload */}
      {isEdit ? (
        <>
          <label htmlFor="image">
            <div className="relative inline-block cursor-pointer">
              <img
                className="w-36 rounded opacity-75"
                src={previewUrl || userData.image}
                alt="Profile Preview"
              />
              {!upImg && (
                <img
                  className="w-10 absolute bottom-0 right-0"
                  src={assets.upload_icon}
                  alt="Upload Icon"
                />
              )}
            </div>
            <input
              onChange={onSelectFile}
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
            />
          </label>
          {/* Crop Tool */}
          {upImg && (
            <div className="mt-4">
              <ReactCrop
                src={upImg}
                crop={crop}
                onImageLoaded={onImageLoaded}
                onComplete={onCropComplete}
                onChange={onCropChange}
                circularCrop={true}
              />
            </div>
          )}
          {/* Editable Name */}
          <input
            className="bg-gray-50 text-3xl font-medium mt-4"
            type="text"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={userData.name}
          />
        </>
      ) : (
        <img className="w-36 rounded" src={userData.image} alt="Profile" />
      )}

      {!isEdit && (
        <p className="font-medium text-3xl text-[#262626] mt-4">{userData.name}</p>
      )}

      <hr className="bg-[#ADADAD] h-[1px] border-none" />

      {/* Contact Information */}
      <div>
        <p className="text-gray-600 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-[#363636]">
          <p className="font-medium">Email:</p>
          <p className="text-blue-500">{userData.email}</p>
          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              className="bg-gray-50 max-w-52"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userData.phone}
            />
          ) : (
            <p className="text-blue-500">{userData.phone}</p>
          )}
          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div>
              <input
                className="bg-gray-50 mb-1"
                type="text"
                placeholder="Address Line 1"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userData.address.line1}
              />
              <input
                className="bg-gray-50"
                type="text"
                placeholder="Address Line 2"
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userData.address.line2}
              />
            </div>
          ) : (
            <p className="text-gray-500">
              {userData.address.line1} <br /> {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div>
        <p className="text-[#797979] underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-gray-600">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="max-w-20 bg-gray-50"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userData.gender}
            >
              <option value="Not Selected">Not Selected</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p className="text-gray-500">{userData.gender}</p>
          )}
          <p className="font-medium">Birthday:</p>
          {isEdit ? (
            <input
              className="max-w-28 bg-gray-50"
              type="date"
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userData.dob}
            />
          ) : (
            <p className="text-gray-500">{userData.dob}</p>
          )}
        </div>
      </div>

      {/* Save / Edit Button */}
      <div className="mt-10">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="border px-8 py-2 rounded-full hover:bg-rose-600 hover:text-white transition-all"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border px-8 py-2 rounded-full hover:bg-rose-600 hover:text-white transition-all"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  ) : null;
};

export default MyProfile;
