import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    specialityList: { type: [String], required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots: [{
        slotDate: { type: String, required: true },
        slotTime: { type: String, required: true },
        status: { 
            type: String, 
            enum: ["Active", "Booked", "Cancelled", "Coming Soon"],
            default: "Active"
        },
        description: { type: String, default: "" }
    }],
    address: { type: Object, required: true },
    languages: { type: [String], required: true },
    date: { type: Number, required: true },
    bannerImage: { type: String },
}, { minimize: false });

const doctorModel = mongoose.models.doctor || mongoose.model("doctor", doctorSchema);
export default doctorModel;