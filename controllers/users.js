/* eslint-disable no-console */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  STATUS_CODE_OK,
  STATUS_CODE_CREATED,
  BadRequestError,
  NotFoundError,
  ConfictRequestError,
} = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      const token = jwt.sign({ userId }, NODE_ENV === 'production' ? JWT_SECRET : 'very-strong-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .status(STATUS_CODE_OK)
        .send({ token });
    })
    .catch(next);
};
module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'Вы успешно вышли' });
};
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      res.status(STATUS_CODE_CREATED).send({
        _id: user._id,
        email: user.email,
        name: user.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConfictRequestError('Email уже используется'));
      }
      next(err);
    });
};
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.user;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некоректные данные'));
      } next(err);
    });
};
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user.userId, { name, email }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.status(STATUS_CODE_OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(new ConfictRequestError('Email уже используется'));
        return;
      }
      next(err);
    });
};
