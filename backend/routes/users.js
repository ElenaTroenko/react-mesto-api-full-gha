const userRouter = require('express').Router();
const auth = require('../middlewares/auth');
const {createUser, getAllUsers, getUser, updateUserAvatar,
  getUserInfo, updateUser, login} = require('../controllers/users');
const { Joi, celebrate } = require('celebrate');
const { urlRegex } = require('../utils/constants');


const createUserSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
};
const loginSchema = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  })
};
const getUserSchema = {
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  })
};
const updateUserSchema= {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    email: Joi.string().email(),
    password: Joi.string().min(8),
  }),
};
const updateUserAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex),
  }),
};


// роуты user, не требующие авторизации
userRouter.post('/signup', celebrate(createUserSchema), createUser);
userRouter.post('/signin', celebrate(loginSchema), login);

// Мидлвар-защита роутов авторизацией
userRouter.use('/', auth);

// роуты user
userRouter.get('/users', getAllUsers);
userRouter.get('/users/me', getUserInfo);
userRouter.get('/users/:userId', celebrate(getUserSchema), getUser);
userRouter.patch('/users/me', celebrate(updateUserSchema), updateUser);
userRouter.patch('/users/me/avatar', celebrate(updateUserAvatarSchema), updateUserAvatar);


module.exports = userRouter;