const { Schema, model } = require('mongoose');

const borrowingSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  borrower: {
    type: Number,
    ref: 'Borrower',
    required: true
  },
  dueDate: {
    type: Date,
    required: true,
    default: () => {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 14); // Adding 14 days
      return currentDate;
    }
  },
  returned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Borrowing = model('Borrowing', borrowingSchema);

module.exports = Borrowing;
