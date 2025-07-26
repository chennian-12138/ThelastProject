import mongoose from 'mongoose';

const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

const Visit = mongoose.model('Visit', visitSchema);
export default Visit;
