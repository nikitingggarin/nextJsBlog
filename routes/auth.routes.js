const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../db/models');

// регистрация
router
  .route('/reg')
  .post(async (req, res) => {
    console.log('---------',req.body);
    const {
      login,
      email,
      password,
    } = req.body;

    if (!login || !email || !password) {
      const error = { message: 'Поля не могут быть пустыми' };
      return res.status(400).json({ error });
    }
    let emailError;
    try {
      emailError = await User.findOne({
        raw: true,
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
    let loginError;
    try {
      loginError = await User.findOne({
        raw: true,
        where: {
          login,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
    if (loginError && emailError) {
      const error = { message: 'Пользователь с таким login и email уже зарегистрирован' };
      return res.status(400).json({ error });
    } if (loginError) {
      const error = { message: 'Пользователь с таким login уже зарегистрирован' };
      return res.status(400).json({ error });
    } if (emailError) {
      const error = { message: 'Пользователь с таким email уже зарегистрирован' };
      return res.status(400).json({ error });
    }
    const saltRounds = process.env.SALT_ROUNDS ?? 10;

    let hashPassword;
    try {
      hashPassword = await bcrypt.hash(password, saltRounds);
    } catch (error) {
      console.log(error);
    }
    if (hashPassword) {
      const user = await User.create({
        login, email, password: hashPassword
      });
      req.session.user = { id: user.id, login: user.login };
      // const user = req.session.user
      // console.log(user);
    }
  
    // return res.status(201).json({ link: '/' });
    return res.status(201).json();
  })


// авторизация
router
  .route('/log')
  .post(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ raw: true, where: { email } });
    console.log(req.body);
    console.log(user);
    if (user) {
      const isTruePassword = await bcrypt.compare(password, user.password);
      if (isTruePassword) {
        req.session.user = { id: user.id, login: user.login};
        
        return res.status(201).json({ link: '/' });
      }
      const error = { message: 'Адрес электронной почты или пароль не совпадает' };
      return res.status(400).json({ error });
    }
    let emailError;
    try {
      emailError = await User.findOne({
        raw: true,
        where: {
          email,
        },
      });
    } catch (error) {
      return res.status(401).json({ error });
    }
    if (!emailError) {
      const error = { message: 'Адрес электронной почты или пароль не совпадает' };
      return res.status(400).json({ error });
    }
  })
  .get((req, res) => {
  req.session.destroy((error) => {
    if (error) {
      res.status(400).json({ error });
      return;
    }
    res.clearCookie('user_sid') 
    res.sendStatus(500).end()
    // res.clearCookie('user_sid', { path: 'http://localhost:5000/auth/log' }) 
    // console.log(req.sessionID);
    // res.cookie('user_sid',{expires: new Date()}) 
    // res.setCookie
      
  });
});

// выход
// router.get('/logout', (req, res) => {
//   req.session.destroy((error) => {
//     if (error) {
//       res.render('error', { message: 'Ошибка при выходе из системы' });
//       return;
//     }
//     res.clearCookie('user_sid') 
      
//   });
// });


module.exports = router;
