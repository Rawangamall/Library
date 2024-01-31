const JWT = require("jsonwebtoken");
const { promisify } = require("util");
const { User, Borrower } = require("./../Models/UserModel");
const catchAsync = require('./../Utils/CatchAsync');
const AppError = require('./../Utils/appError');

class VerifyBase {
  constructor(model) {
    this.model = model;
  }

  Verify = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new AppError('You\'re not logged in, please go to login page', 401));
    }

    
      const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);
      //console.log(decoded.id);
      //console.log(this.model, "model");

      const user = await this.model.findById(decoded.id);

      if (!user || !user.phoneVerify) {
        return next(new AppError('You\'re not verified your number, please go to verify it first', 401));
      }

      next();

  });
}

const userPHVerifyMW = new VerifyBase(User);
const borrowerPHVerifyMW = new VerifyBase(Borrower);

module.exports = { userPHVerifyMW, borrowerPHVerifyMW };

