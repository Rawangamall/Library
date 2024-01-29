import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

const {Borrower} = require('./../Models/UserModel');
const CatchAsync = require('./../Utils/CatchAsync');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

class BorrowerController {

  static getBorrowerProfile = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);
    const borrower = await Borrower.findById(borrowerId);

    if (!borrower) {
      return res.status(400).json({ error: 'Borrower not found' });
    }
    res.status(200).json(borrower);
  });

  static getAllBorrowers = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowers = await Borrower.find();
    if (borrowers.length === 0) {
      return res.status(200).json({ message: "There's no borrower" });
    }
    res.status(200).json(borrowers);
  });

  static updateBorrower = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);

    if (req.body.password) {
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
    }

    const borrower = await Borrower.findByIdAndUpdate(
      borrowerId,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true } // Return the updated document
    );

    if (!borrower) {
      return res.status(400).json({ error: 'Borrower not found' });
    }

    res.status(200).json(borrower);
  });

  static deleteBorrower = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const borrowerId = parseInt(req.params.id);

    const borrower = await Borrower.findByIdAndDelete(borrowerId);
    if (!borrower) {
      return res.status(400).json({ error: "There's no borrower" });
    }

    res.status(200).json(borrower);
  });
}

export default BorrowerController;
