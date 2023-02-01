import { body, validationResult } from "express-validator";

// Inspiration - https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go
const userValidationRules = () => {
  return [
    body("name")
      .not()
      .isEmpty()
      .withMessage("Please enter individual/organization name")
      .isLength({ max: 25 })
      .withMessage("Please decrease word count of name")
      .trim()
      .escape(),
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .normalizeEmail(),
    body("phone")
      .isMobilePhone()
      .trim()
      .escape()
      .withMessage("Please enter correct phone number"),
    body("natureOfWork")
      .not()
      .isEmpty()
      .withMessage(
        "Please provide some information about the nature of data submitted"
      )
      .isLength({ max: 1200 })
      .withMessage("Please decrease word size of Nature of Work")
      .trim()
      .escape(),

    body("description")
      .not()
      .isEmpty()
      .withMessage(
        "Please provide some information about the type of data submitted"
      )
      .isLength({ max: 1200 })
      .withMessage("Please decrease word count of Nature of Work")
      .trim()
      .escape(),
  ];
};

const recepientValidationRules = () => {
  return [
    body("first_name")
      .not()
      .isEmpty()
      .withMessage("Please enter first name of recepient")
      .isLength({ max: 25 })
      .withMessage("Please decrease word count of name")
      .trim()
      .escape(),
    body("last_name")
      .not()
      .isEmpty()
      .withMessage("Please enter last name of recepient")
      .isLength({ max: 25 })
      .withMessage("Please decrease word count of name")
      .trim()
      .escape(),
    body("email")
      .isEmail()
      .withMessage("Please enter valid email")
      .normalizeEmail(),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    validationErrors: extractedErrors,
  });
};

export { userValidationRules, recepientValidationRules, validate };
