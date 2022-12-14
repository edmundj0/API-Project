const express = require('express');

const { requireAuth } = require('../../utils/auth')
const { Spot, User, Review, SpotImage, ReviewImage } = require('../../db/models')

const router = express.Router();

const { validateNewReview } = require('./validations');


// Get all Reviews of the Current User (require auth - true)

router.get('/current', requireAuth, async (req, res) => {

    const { user } = req;

    let currentUserReviews = await Review.findAll({
        where: { userId: user.id },
        include: [
            { model: User, attributes: ['id', 'firstName', 'lastName'] },
            { model: Spot, attributes: { exclude: ['createdAt', 'updatedAt', 'description'] } },
            { model: ReviewImage, attributes: ['id', 'url'] }
        ]
    })

    //let returnArr = [];
    // for (let eachReview of currentUserReviews){
    for (let i = 0; i < currentUserReviews.length; i++) {
        //eachReview = eachReview.toJSON()
        currentUserReviews[i] = currentUserReviews[i].toJSON()

        let previewImg = await SpotImage.findOne({
            where: {
                spotId: currentUserReviews[i].Spot.id,
                preview: true
            }
        })


        if (!previewImg) {
            currentUserReviews[i].Spot.previewImage = null
        } else {
            currentUserReviews[i].Spot.previewImage = previewImg.url
        }

        //returnArr.push(eachReview)
    }

    return res.status(200).json({
        // Reviews: returnArr
        Reviews: currentUserReviews
    })
})


//Add an Image to a Review based on the Review's Id

router.post('/:reviewId/images', requireAuth, async (req, res) => {

    const { reviewId } = req.params

    const review = await Review.findByPk(reviewId)

    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if (review.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    const allReviewImages = await ReviewImage.findAll({
        where: { reviewId: reviewId }
    })

    if (allReviewImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }

    let newImageReview = await ReviewImage.create({
        reviewId: reviewId,
        url: req.body.url
    })

    newImageReview = newImageReview.toJSON();
    delete newImageReview.createdAt
    delete newImageReview.updatedAt
    delete newImageReview.reviewId

    return res.status(200).json(newImageReview)
})

//Edit a Review

router.put('/:reviewId', requireAuth, validateNewReview, async (req, res) => {

    const { reviewId } = req.params

    let reviewToEdit = await Review.findByPk(reviewId)

    if (!reviewToEdit) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if (reviewToEdit.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    const { review, stars } = req.body

    reviewToEdit = await reviewToEdit.update({
        review,
        stars
    })

    return res.status(200).json(reviewToEdit)

})


//DELETE a Review

router.delete('/:reviewId', requireAuth, async (req, res) => {

    const deleteReview = await Review.findByPk(req.params.reviewId)

    if (!deleteReview) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        })
    }

    if (deleteReview.userId !== req.user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await deleteReview.destroy();

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router;
