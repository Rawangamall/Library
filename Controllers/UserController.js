const {User} = require('./../Models/UserModel');
const bcrypt = require('bcrypt');
const CatchAsync = require('./../Utils/CatchAsync');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserController {
  static createUser =  CatchAsync(async (req, res, next) =>{
      const hash = await bcrypt.hash(req.body.password, salt);

      const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        email: req.body.email,
        password: hash,
        salary: parseFloat(req.body.salary),
        image: "default.jpg"
      });
      res.status(201).json(newUser);
    }
  );

  static getUserProfile = CatchAsync(async (req, res, next) => {
      const userId = parseInt(req.params.id);

      const user = await User.findById(userId).select('-password -code -passwordResetExpires');
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      res.status(200).json(user);
  
  })

  static getAllUsers =CatchAsync(async (req,res,next)=>{

    const users = await User.find().select('-password -code -passwordResetExpires');
    if(users.length == 0){
        return res.status(400).json({ error: "There's no user" });
    }

    res.status(200).json(users);

  });

  static UpdateUser =CatchAsync(async (req,res,next)=>{
    const userId = parseInt(req.params.id);

    const user = await User.findByIdAndUpdate(
        userId,
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: hash,
            salary: parseFloat(req.body.salary),
        },
        { new: true } // Return the updated document
      );

    if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

  });

  static delUser =CatchAsync(async (req,res,next)=>{
    const userId = parseInt(req.params.id);
// *rember to check on the return of books
    const user = await User.findByIdAndDelete(userId);
    if(!user){
        return res.status(400).json({ error: "There's no user" });
    }

    res.status(200).json(user);

  });
}

module.exports = UserController;
