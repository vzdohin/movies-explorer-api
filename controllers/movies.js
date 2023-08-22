/* eslint-disable no-console */
/* eslint-disable consistent-return */
const Movie = require('../models/movie');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require('../errors/errors');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user.userId,
  })
    .then((movie) => {
      console.log(movie);
      res.status(STATUS_CODE_CREATED).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некоректные данные'));
      }
      next(err);
    });
};
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.userId })
    .then((movies) => res.status(STATUS_CODE_OK).send(movies))
    .catch((err) => {
      next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      console.log(req.params);
      if (movie === null) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (movie.owner.toString() !== req.user.userId) {
        return next(new ForbiddenError('У Вас нет прав для удаления этой карточки'));
      }
      Movie.findByIdAndRemove(req.params.id)
        .then(() => {
          res.status(STATUS_CODE_OK).send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new BadRequestError('Переданы некоректные данные'));
          }
          next(err);
        });
    })
    .catch(next);
};
