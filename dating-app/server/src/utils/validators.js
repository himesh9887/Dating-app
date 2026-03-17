import { body, param, query, validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    next();
    return;
  }

  res.status(422).json({
    message: "Validation failed",
    errors: errors.array().map(({ path, msg }) => ({ field: path, message: msg })),
  });
};

export const registerValidator = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name is required"),
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .matches(/^[a-zA-Z0-9_.]+$/)
    .withMessage("Username should be 3-20 characters"),
  body("email").trim().isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters"),
  body("age").optional().isInt({ min: 18, max: 99 }).withMessage("Age must be 18+"),
  validateRequest,
];

export const loginValidator = [
  body("identifier")
    .trim()
    .notEmpty()
    .withMessage("Email or username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
];

export const googleValidator = [
  body("credential").notEmpty().withMessage("Google credential is required"),
  validateRequest,
];

export const updateProfileValidator = [
  body("name").optional().trim().isLength({ min: 2 }),
  body("age").optional().isInt({ min: 18, max: 99 }),
  body("bio").optional().isLength({ max: 280 }),
  body("interests").optional().isArray({ max: 10 }),
  validateRequest,
];

export const postValidator = [
  body("caption").optional().isLength({ max: 400 }),
  body("hashtags").optional().isArray({ max: 10 }),
  validateRequest,
];

export const commentValidator = [
  body("comment").trim().isLength({ min: 1, max: 200 }),
  validateRequest,
];

export const swipeValidator = [
  body("action")
    .isIn(["like", "dislike", "superlike"])
    .withMessage("Action must be like, dislike or superlike"),
  validateRequest,
];

export const messageValidator = [
  body("message").optional().isLength({ min: 1, max: 1500 }),
  body("messageType")
    .optional()
    .isIn(["text", "image", "gif"])
    .withMessage("Invalid message type"),
  validateRequest,
];

export const searchValidator = [
  query("ageMin").optional().isInt({ min: 18, max: 99 }),
  query("ageMax").optional().isInt({ min: 18, max: 99 }),
  query("distance").optional().isInt({ min: 1, max: 500 }),
  validateRequest,
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid id"),
  validateRequest,
];

export const matchParamValidator = [
  param("matchId").isMongoId().withMessage("Invalid match id"),
  validateRequest,
];
