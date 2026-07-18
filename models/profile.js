import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    goal: { type: String, required: true, enum: ['Weight Gain', 'Weight Loss'] }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;