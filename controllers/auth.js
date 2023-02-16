const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { User } = require('../models/user')

const { HttpError, ctrlWrapper } = require('../helpers')

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password, subscription } = req.body
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `email ${email} in use `)
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const result = await User.create({password: hashPassword, email, subscription})
    
    res.json({
    // password: result.password,
    email: result.email,    
    subscription: result.subscription,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
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

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user
    res.json({
        email,
        subscription
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
    logout: ctrlWrapper(logout)
}