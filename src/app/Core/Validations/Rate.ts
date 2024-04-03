import { body ,param} from "express-validator";

export const RateValidPOST = [
body('value').isNumeric().withMessage("please enter valid numeric rate"),
param('id').isMongoId().withMessage("please choose available existed book")
]