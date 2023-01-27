import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { User } from "../types";

const mapErrors = (schemaErrors: Joi.ValidationErrorItem[]) => {
  const errors = schemaErrors.map((error) => {
    let { path, message } = error;
    return { path, message };
  });

  return {
    status: "failed",
    errors,
  };
};

export const validateSchema = (schema: Joi.ObjectSchema<User>) => {  
  return (req: Request, res: Response, next: NextFunction) => {    
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error?.isJoi) {
      res.status(400).json(mapErrors(error.details));
    } else {
      next();
    }
  };
};