const {Schema, model} = require('mongoose')

const {mongooseHandleError} = require('../helpers')

const Joi = require('joi')

const emailRegexp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const userSchema = new Schema({
  password: {
    type: String,
    minlength: 6,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: emailRegexp,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
    token: {
        type: String,
        default: ""
  },
  avatarURL: {
        type: String,
        required: true,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    default: ""
  }
    
}, { versionKey: false, timestamps: true })

userSchema.post('save', mongooseHandleError)

const registerSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).message("валідність вашого email викликає підозри").required(),    
    subscription: Joi.string().required(),
}) 

const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),    
}) 

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),    
}) 

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(), 
})

const schemas = {
    loginSchema,
    registerSchema,
  updateSubscriptionSchema,
    emailSchema,
}

const User = model('user', userSchema)

module.exports = {
    User,
    schemas,
}