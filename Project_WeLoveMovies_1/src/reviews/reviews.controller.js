const service = require('./reviews.service')
const asyncErrorBoundary = require('../errors/asyncErrorBoundary')

function read(req,res) {
    const {review: reviewData} = res.locals
    res.json({data: reviewData})
}

async function reviewExists(req,res,next) {
    const reviewList = await service.read(req.params.reviewId)
    const review = reviewList[0]
    if (review) {
        res.locals.review = review
        return next()
    }
    next({status: 404, message: 'Review cannot be found.'})
}

async function add(req,res) {
    const review = await service.add(req.params.reviewId)
    review.critic.critic_id = review.critic_id
    res.json({data: review})
}

async function update(req,res) {
    const updatedReview = {...req.body.data}
    const id = req.params.reviewId
    await service.update(updatedReview, id)
    const update = await service.add(id)
    const now = new Date().toISOString()
    const timestamp = {created_at: now, updated_at: now}

    const data = {...update, ...timestamp}
    res.json({data})
}

async function destroy(req,res) {
    const review_id = req.params.reviewId
    await service.delete(review_id)
    res.sendStatus(204)
}

module.exports = {
    read: [asyncErrorBoundary(reviewExists), read],
    add: [asyncErrorBoundary(reviewExists), add],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)]
}