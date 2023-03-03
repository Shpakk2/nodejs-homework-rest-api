const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require("gravatar")
const path = require("path")
const fs = require("fs/promises")
const Jimp = require("jimp");
const { nanoid } = require('nanoid')

const { User } = require('../models/user')

const { HttpError, ctrlWrapper, sendEmail } = require('../helpers')

const { SECRET_KEY, BASE_URL } = process.env;
const avatarDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
    const { email, password, subscription } = req.body
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `email ${email} in use `)
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email)
    const verificationToken = nanoid()
    const result = await User.create({password: hashPassword, email, subscription, avatarURL, verificationToken})
    
    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">click verify email</a>`
    }

    await sendEmail(verifyEmail)

    res.json({
    email: result.email,    
    subscription: result.subscription,
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken })
    if (!user) {
        throw HttpError(404, "User not found")
    }

    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
    res.json({
        message: 'Verification successful',
    })
}

const resendVerifyEmail = async (req, res) => { 
    const { email } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(404, "Email not found")
    }
    if (user.verify) {
      throw HttpError(404, "Verification has already been passed")
    }

    const verifyEmail = {
        to: email,
        subject: "verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">click verify email</a>`
    }

    await sendEmail(verifyEmail)

    res.json( {
    "message": "Verification email sent"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify")
    }

    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, {token})
    res.json({
        token,
    })
}

const updateAvatar = async (req, res) => {
    const { path: tempUpload, originalname } = req.file;
    await Jimp.read(tempUpload).then(image => {
    return image.resize(250, 250).write(tempUpload);
    }).catch(err => {
        throw err;
    })
    const { _id } = req.user;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarDir, filename);
    setTimeout(async () =>  {
    await fs.rename(tempUpload, resultUpload);
    }, 1000);
    const avatarURL = path.join("avatars", filename)
    await User.findByIdAndUpdate(_id, { avatarURL })
    
    res.json({
        avatarURL,
    })
}

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user
    res.json({
        email,
        subscription
    })
}

const updateSubscription = async (req, res) => {
    const { subscription } = req.body
    const { email } = req.user
    await User.findByIdAndUpdate(req.user._id, { subscription: subscription })
    
        res.json({
        email,
        subscription,
    })
}

const logout = async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { token: "" })
    
    res.status(204).json({
        message: "No Content"
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail)
}