const express = require('express');
const mongoose = require('mongoose');
const cardRouter = require('./routes/cards');
const userRouter = require('./routes/users');
const bodyParser = require('body-parser');
const UniError = require('./utils/errors');
const { sendError } = require('./utils/utils');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { DB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();


// логгер запросов
app.use(requestLogger);

app.use(bodyParser.json());
app.use('/', userRouter);           // Роутер пользователей
app.use('/', cardRouter);           // Роутер карт
app.use('/', () => {                // Хэндлер 404 страниц
  throw(new UniError({name: 'DocumentNotFoundError'}, 'Страница не найдена'));
});

// логгер ошибок
app.use(errorLogger);

app.use(errors());                  // Обработчик ошибок celebrate
app.use((err, req, res, next) => {  // Централизованный бработчик ошибок
  sendError(err, res);
  next();
});

// Подключение к БД
mongoose.connect(DB);

// Запуск
app.listen(PORT, () => {
  console.log(`Слушаю порт ${PORT}...`);
});