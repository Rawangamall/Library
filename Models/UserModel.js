const { Schema, model ,mongoose} = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");

const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return regex.test(email);
};

const baseSchema = new Schema({ 
  _id: Number,
  firstName: String,
  lastName: String,
  password: { type: String, select: false },
  image:{ type : String , default:"default.jpg"},
  role: { type: String, required: true , enum: ['admin', 'employee', 'manager' , 'borrower'] },
  active: {
    type: Boolean,
    default: true,
  },
  phoneVerify:{ type : Boolean , default:false}
}
,{ timestamps: true});

//check on password in 
baseSchema.methods.correctPassword = async function (
  candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

baseSchema.plugin(AutoIncrement, { id: "user", inc_field: "_id" });


//mapping
//inheriting from the base schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "invalid email"],
    unique: true,    //separated from the base for the uniquness
  },
  phoneNumber: {type:String, unique:true},
  hiringDate: {type:Date, default:Date.now()},
  salary:  { type: Number, default: 0.0}
});
UserSchema.add(baseSchema);

const BorrowerSchema = new Schema({
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "invalid email"],
    unique: true,
  },
  phoneNumber: {type:String, unique:true},
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});
BorrowerSchema.add(baseSchema);

// list mongoose models
const User = model("User", UserSchema);
const Borrower = model("Borrower", BorrowerSchema);

module.exports = { User, Borrower };