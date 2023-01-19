import Joi from "joi";

const strongPasswordRegex = /^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/;
const stringPasswordError = "Password must be strong. At least one lower case alphabet. At least one digit. Minimum eight in length";

const userSchemaPost = Joi
.object()
.keys({
  id: Joi.string(),
  login: Joi.string().required(),
  password: Joi.string().regex(strongPasswordRegex, stringPasswordError).required(),
  age: Joi.number().integer().min(4).max(130).required(),
  isDeleted: Joi.boolean(),
});

const userSchemaPatch = Joi
.object()
.keys({
  id: Joi.string(),
  login: Joi.string(),
  password: Joi.string().regex(strongPasswordRegex, stringPasswordError),
  age: Joi.number().integer().min(4).max(130),
  isDeleted: Joi.boolean(),
});


export default {
  userSchemaPost,
  userSchemaPatch,
};