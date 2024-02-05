const {User} = require('./../Models/UserModel');
const UserClass = require('./../Classes/UserClass');
const QueryOperation = require('./QueryOperations').default
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
      const user = new User(newUser);

      const savedUser = await user.save(newUser);
                 console.log(newUser)

          console.log("saved:",savedUser)

    res.status(201).json(savedUser);
    console.log("after:",savedUser)

          }
  );

  static getUserProfile = CatchAsync(async (req, res, next) => {
      const userId = parseInt(req.params.id);
      const user = await User.findById(userId);     //.select('-password -code -passwordResetExpires')   jest error

      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }
      res.status(200).json(user);
  
  })

  static getAllUsers =CatchAsync(async (req,res,next)=>{
    const { searchTerm } = req.query; 
    const limit = parseInt(req.query.limit) || 7
    const sortField = req.query.sortField || "createdAt"
    const queryOperations = new QueryOperation();

    let usersQuery = User.find() 

    if (searchTerm) {
      usersQuery = queryOperations.search(usersQuery, searchTerm , ['email', 'role', 'phoneNumber']);
    }
    const filteredUsersQuery = queryOperations.sort(queryOperations.limit(usersQuery, limit), sortField); //nested query
    const users = await filteredUsersQuery.exec(); 

    if(users.length == 0){
        return res.status(200).json({ message: "There's no user" });
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
