const {Schema, model} = require('mongoose')

const Joi = require('joi')

const {mongooseHandleError} = require('../helpers')

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
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
}, { versionKey: false })

contactSchema.post("save", mongooseHandleError)

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