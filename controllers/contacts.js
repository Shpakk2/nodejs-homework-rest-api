

const {HttpError, ctrlWrapper} = require('../helpers')

const {Contact} = require("../models/contact")

const getAll = async (req, res) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 12, favorite} = req.query;
    const skip = (page - 1) * limit;
    const result  = await Contact.find(favorite ? { owner, favorite }: {owner}, "-__v", {
        skip,
        limit: limit,
    }).populate("owner", "email");
    
    return res.json(result);
}

const getById = async (req, res) => {
    const { contactId } = req.params
    const result = await Contact.findById(contactId)
    if (!result) {
      throw HttpError(404, `Contact with id:${contactId} not found`)
    }
    res.json(result)
}

const add = async (req, res) => {
    const {_id: owner} = req.user
    const result = await Contact.create({...req.body, owner})
    res.status(201).json(result)
}

const updateById = async (req, res) => {
      const { contactId } = req.params
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
          if (!result) {
      throw HttpError(404, `Contact with id:${contactId} not found`)
    }
    res.json(result)
}

const updateFavorite = async (req, res) => {
      const { contactId } = req.params
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true})
          if (!result) {
      throw HttpError(404, `Contact with id:${contactId} not found`)
    }
    res.json(result)
}

const deleteById = async (req, res) => {
      const { contactId } = req.params
      const result = await Contact.findByIdAndDelete(contactId)
          if (!result) {
      throw HttpError(404, `Contact with id:${contactId} not found`)
    }
      res.json({
      message: `contact with id:${contactId} deleted`
    })
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById) ,
    add: ctrlWrapper(add) ,
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById) ,
}