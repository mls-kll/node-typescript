import mongoose from 'mongoose';

const PigSchema = new mongoose.Schema({
  id: String,
  breed: String,
  description: String,
  img: String
});

export const Pig = mongoose.model('Pig', PigSchema);
