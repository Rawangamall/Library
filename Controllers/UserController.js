const {User} = require('./../Models/UserModel');
const UserClass = require('./../Classes/UserClass');
const bcrypt = require('bcrypt');
const CatchAsync = require('./../Utils/CatchAsync');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class UserController {
  
  static createUser =  CatchAsync(async (req, res, next) =>{

      const hash = await bcrypt.hash(req.body.password, salt);
      const { firstName, lastName,phoneNumber,role, email,salary} = req.body;

      //user object from user class
      const newUser = new UserClass(firstName, lastName,phoneNumber,role, email,hash,parseFloat(salary));
        //console.log(typeof(newUser),newUser)
      const user = new User(newUser);
      await user.save();
 
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

     if(req.body.password){
    const hash = await bcrypt.hash(req.body.password, salt);
    req.body.password = hash};

     if (req.body.salary) req.body.salary = parseFloat(req.body.salary);


    const user = await User.findByIdAndUpdate(
        userId,
        {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            salary:req.body.salary,
        },
        { new: true } // Return the updated document
      );

    if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      res.status(200).json(user);

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
