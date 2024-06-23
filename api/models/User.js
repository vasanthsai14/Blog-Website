const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 5, unique: true },
  password: { type: String, required: true },
  category: { type: String, required: false },
  email: { type: String, required: false, unique: true },
  bio: { type: String },
  profilePicture: { type: String },
});

const UserModel = model('User', UserSchema);
module.exports = UserModel;

