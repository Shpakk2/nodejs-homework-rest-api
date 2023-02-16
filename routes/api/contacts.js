const express = require("express")

const router = express.Router()

const ctrl = require('../../controllers/contacts')

const { validateBody, isValidId, authenticate} = require('../../middlewares')

const {schemas} = require("../../models/contact")

router.get('/', authenticate, ctrl.getAll)

router.get('/:contactId', authenticate, isValidId, ctrl.getById)

router.post('/', authenticate, validateBody(schemas.addScheme), ctrl.add)

router.delete('/:contactId', authenticate, isValidId, ctrl.deleteById)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addScheme), ctrl.updateById)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema),  ctrl.updateFavorite)


module.exports = router
