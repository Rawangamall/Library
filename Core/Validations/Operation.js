const { body,param , query} = require("express-validator");
const moment = require('moment');

exports.BorrowingValidPOST = [
    param('id').isMongoId().withMessage('Invalid book id'),
    body('dueDate').custom((value) => {
        const currentDate = moment();
        const dueDateObj = moment(value, 'YYYY-MM-DD', true);
      
     if (!dueDateObj.isValid() || dueDateObj.isBefore(currentDate)) {
            return Promise.reject('Due date must be a valid future date');
        }
    
        return true;
      }),
];

exports.BorrowingValidGet = [
    query('filter').isBoolean().withMessage('choose the returned or non returned filter'),
];

