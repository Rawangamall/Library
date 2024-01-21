const { Schema, model } = require('mongoose');
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//create schema object
const validateEmail = function (email) {
  const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  return regex.test(email);
};

const baseSchema = new Schema({
  _id: Number,
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true,
    validate: [validateEmail, "invalid email"],
    unique: true,
  },
  password: { type: String, select: false },
  image:{ type : String , default:"default.jpg"},
  role: { type: String, required: true },
  phoneNumber: {type:String, unique:true},
  active: {
    type: Boolean,
    default: true,
  },
   
  code: String,
  passwordResetExpires: Date,
}
,{ timestamps: true});

baseSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

baseSchema.methods.createPasswordRandomToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.code = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min

  return resetToken;
};

baseSchema.plugin(AutoIncrement, { id: "user_id", inc_field: "_id" });


//mapping
//inheriting from the base schema
const UserSchema = new Schema({
  iringDate: {type:Date, default:Date.now()},
  salary: {type:Decimal}
});
UserSchema.add(baseSchema);

const BorrowerSchema = new Schema({
  wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});
BorrowerSchema.add(baseSchema);

// list mongoose models
const User = model("User", UserSchema);
const Borrower = model("Borrower", BorrowerSchema);

module.exports = { User, Borrower };