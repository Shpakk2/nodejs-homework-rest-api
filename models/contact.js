const {Schema, model} = require('mongoose')

const Joi = require('joi')

const contactSchema = new Schema({
     name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
}, { versionKey: false })

contactSchema.post("save", (error, data, next)=> {
  error.status = 400;
  next()
})

const Contact = model("contact", contactSchema)


const addScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
}) 

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(), 
})

const schemas = {
  addScheme,
  updateFavoriteSchema,
}

module.exports = {
  Contact,
  schemas,
};