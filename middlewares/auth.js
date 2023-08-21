/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/errors');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
// module.exports = (req, res, next) => {
//   const token = req.headers.cookie;
//   if (!token) {
//     return next(new UnauthorizedError('Необходима авторизация'));
//   }
module.exports = (req, res, next) => {
  const tok = req.headers.cookie;
  if (!tok) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const cookies = req.headers.cookie.split('; ');
  const tokenCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  if (!tokenCookie) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = tokenCookie.split('=')[1];
  let payload;
  try {
    // eslint-disable-next-line no-unused-vars
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'very-strong-key');
    req.user = payload;
  } catch (err) {
    console.log(token);
    return next(new UnauthorizedError('Токен не прошел проверку'));
  }
  return next();
};
