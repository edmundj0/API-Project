const express = require('express');

const { requireAuth } = require('../../utils/auth')
const { Spot, SpotImage } = require('../../db/models')

const router = express.Router();

//Delete a spot image
router.delete('/:imageId', requireAuth, async (req, res) => {

    const { imageId } = req.params

    const image = await SpotImage.findByPk(imageId)

    if (!image) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    const spot = await Spot.findByPk(image.spotId)

    if (spot.ownerId != req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await image.destroy()

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router;
