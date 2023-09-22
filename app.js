/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
// const limiter = require('./middlewares/rateLimiter');
const { createUser, login, logout } = require('./controllers/users');
const { NotFoundError } = require('./errors/errors');
const { handleOtherErrors } = require('./errors/handleOtherErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');

const app = express();
const { PORT = 3000 } = process.env;

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

// app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.post('/signout', logout);
app.use(auth);
app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use('*', () => {
  throw new NotFoundError('Страница не найдена');
});

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Подключилось к MongoDB');
  })
  .catch((err) => {
    console.error('Ошибка подключения к MongoDB:', err.message);
  });
app.use(errorLogger);
app.use(errors());
app.use(handleOtherErrors);
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
