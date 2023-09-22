/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
// const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9\.\-]+\/[a-zA-Z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/gi) !== null,
      message: 'Неправильный формат ссылки',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9\.\-]+\/[a-zA-Z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/gi) !== null,
      message: 'Неправильный формат ссылки',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => value.match(/^(http|https):\/\/(?:www\.)?[a-zA-Z0-9\.\-]+\/[a-zA-Z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/gi) !== null,
      message: 'Неправильный формат ссылки',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
