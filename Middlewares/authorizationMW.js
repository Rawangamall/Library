const JWT= require("jsonwebtoken");
const { promisify } = require("util")


exports.authorize = (roles) => {
    return async (req, res, next) => {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
           token = req.headers.authorization.split(' ')[1];
        }
        if(!token){
           return next(new AppError('You\'re not logged in, please go to login page',401));
        }
       
       const decoded = await promisify(JWT.verify)(token,process.env.JWT_SECRET);
       
        const userRole = decoded.role;

        if (!roles.includes(userRole)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  
      next();
    };
  };