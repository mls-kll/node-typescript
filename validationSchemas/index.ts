const Joi = require('joi');

export const idSchema = Joi.string().min(24).max(24).required();
export const pigSchema = Joi.object({
  breed: Joi.string(),
  description: Joi.string(),
});
