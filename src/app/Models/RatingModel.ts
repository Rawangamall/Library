import mongoose, { model ,Schema} from "mongoose";


const ratingSchema = new Schema({
  user: {
    type: Number,
    ref: 'User',
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  ratingValue: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  }
});

const Rating = model('Rating', ratingSchema);

export default Rating;