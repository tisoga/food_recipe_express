import { Router } from 'express';
import { getUser, insertNewUser, listAllUser, loginUser } from '../controller/userController.js';
import authCheckToken from '../middleware/authCheck.js';

const router = Router()

router.get('/users', authCheckToken, listAllUser)

router.get('/user', authCheckToken, getUser)

router.post('/login', loginUser)

router.post('/register', insertNewUser)

export default router