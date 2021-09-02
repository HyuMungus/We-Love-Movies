const knex = require('../db/connection')

function read(id) {
    return knex('movies').select('*').where({movie_id: id})
}

function list() {
    return knex('movies').select('*')
}

function listCritics() {
    return knex('critics').select('*')
}

function listShowing() {
    return knex('movies as m')
        .join('movies_theaters as mt', 'm.movie_id', 'mt.movie_id')
        .distinct('m.*')
        .where({'mt.is_showing': true})
}

function getReviewsByMovieId(id) {
    return knex('reviews as r')
        .join('movies as m', 'r.movie_id', 'm.movie_id')
        .select('r.*')
        .where({'r.movie_id': id})
}

function getTheatersByMovieId(id) {
    return knex('theaters as t')
        .join('movies_theaters as mt', 't.theater_id', 'mt.theater_id')
        .select('t.*', 'mt.is_showing', 'mt.movie_id')
        .where({'mt.movie_id': id})
}

module.exports = {
    read,
    list,
    listCritics,
    listShowing,
    getReviewsByMovieId,
    getTheatersByMovieId
}