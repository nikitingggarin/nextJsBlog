// хранилище секретных переменных
require('dotenv').config();
const express = require('express');
// вывод в консоль
const logger = require('morgan');
// путь
const path = require('path');
//бд
// const { Post } = require('./db/models');
const cors =require('cors')

const cookieParser = require('cookie-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const authRouter = require('./routes/auth.routes');
const postRouter = require('./routes/post.routes');
const editpostRouter = require('./routes/editpost.routes');


const app = express();
app.use(cors({ credentials:  true, origin: 'http://localhost:3000' }))
const PORT = process.env.PORT || 5000;

// Подключаем middleware morgan с режимом логирования "dev",
// чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(logger('dev'));
// Подключаем middleware, которое сообщает epxress,
// что в папке "ПапкаПроекта/public" будут находится статические файлы,
// т.е. файлы доступные для скачивания из других приложений.
app.use(express.static(path.join(__dirname, 'public')));
// Подключаем middleware,
// которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
//  запуск сессии
const sessionConfig = {
  store: new FileStore(),
  name: 'user_sid', // Имя куки для хранения id сессии. По умолчанию - connect.sid
  secret: process.env.SESSION_SECRETS,
  resave: false, // Пересохранять ли куку при каждом запросе
  saveUninitialized: false, // Создавать ли сессию без инициализации ключей в req.session
  cookie: {
    maxAge: 1000 * 60 * 60 * 12, // Срок истечения годности куки в миллисекундах
    httpOnly: true, // Серверная установка и удаление куки, по умолчанию true
  },
};
app.use(session(sessionConfig));
app.use(cookieParser());



app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/edit-post', editpostRouter);

app.listen(PORT, () => {
  console.log(`server started PORT: ${PORT}`);
});
